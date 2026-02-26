"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const phone = formData.get("phone") as string

  if (!email || !password || !fullName) {
    return { error: "Email, password, and full name are required." }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If signUp was successful and we have a user, manually insert into profiles
  // as insurance if no database trigger exists. 
  // Note: Depending on Supabase settings, the user might need to confirm email first,
  // but we can still try to create the profile. If RLS is strict, this might fail without a service role.
  // However, the user provided the schema, so we should attempt to fulfill it.
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          role: "customer",
        },
      ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // We don't necessarily want to fail the whole signup if the profile insert fails
      // (e.g. if a trigger already did it), but it's good to know.
    }
  }

  return { success: true, message: "Check your email for the confirmation link." }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

    if (data.user) {
      console.log("Login successful for user:", data.user.email)
      
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()

      if (profileError) {
        console.error("Error fetching profile during login:", profileError)
      }

      console.log("Fetched profile role:", profile?.role)

      // If profile is missing, try to create it
      if (!profile) {
        console.log("Profile missing, creating default profile for user...")
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || "Member",
            email: data.user.email,
            role: "customer"
          })
          .select("role")
          .single()
        
        if (insertError) {
          console.error("Error creating profile:", insertError)
        } else if (newProfile) {
          profile = newProfile
          console.log("New profile created with role:", profile.role)
        }
      }

      if (profile?.role?.toLowerCase() === "admin") {
        console.log("Admin detected, redirecting to /admin")
        return { success: true, redirectTo: "/admin" }
      } else {
        console.log("Customer detected, redirecting to /home")
      }
    }

    return { success: true, redirectTo: "/home" }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }
  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithFacebook() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }
  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
