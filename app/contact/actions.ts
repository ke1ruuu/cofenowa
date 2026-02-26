"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitFeedback(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const fullName = formData.get("full_name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!fullName || !email || !message) {
        return { error: "Full name, email, and message are required." }
    }

    const { error } = await supabase
        .from("feedbacks")
        .insert([{
            user_id: user?.id || null,
            full_name: fullName,
            email: email,
            subject: subject,
            message: message
        }])

    if (error) {
        console.error("Error submitting feedback:", error)
        return { error: error.message }
    }

    revalidatePath("/admin/feedbacks")
    return { success: true, message: "Thank you for your feedback! We'll get back to you soon." }
}
