import { createClient } from "@/utils/supabase/server"
import { MessageSquare, Trash2, Mail, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"
import { deleteFeedback, updateFeedbackStatus } from "../actions"

export default async function AdminFeedbacksPage() {
    const supabase = await createClient()
    
    const { data: feedbacks } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Customer Feedback</h1>
                    <p className="text-[#8a7560] font-medium mt-2">View and manage messages from your customers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {feedbacks?.map((feedback) => (
                    <div key={feedback.id} className="bg-white rounded-[2.5rem] border border-[#e6e0db] p-8 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                        feedback.status === 'pending' ? 'bg-amber-50' : 'bg-green-50'
                                    }`}>
                                        {feedback.status === 'pending' ? (
                                            <Clock className="h-5 w-5 text-amber-600" />
                                        ) : (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{feedback.subject || "No Subject"}</h3>
                                        <div className="flex items-center gap-2 text-sm text-[#8a7560]">
                                            <span className="font-bold text-[#181411]">{feedback.full_name}</span>
                                            <span>&bull;</span>
                                            <span>{feedback.email}</span>
                                            <span>&bull;</span>
                                            <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-[#f8f7f5] rounded-2xl p-6 text-[#181411] italic leading-relaxed">
                                    "{feedback.message}"
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 md:w-48">
                                {feedback.status === 'pending' && (
                                    <form action={async () => {
                                        "use server"
                                        await updateFeedbackStatus(feedback.id, 'reviewed')
                                    }}>
                                        <Button className="w-full bg-[#f27f0d] hover:bg-[#d96d00] rounded-xl font-bold">
                                            Mark Reviewed
                                        </Button>
                                    </form>
                                )}
                                <a href={`mailto:${feedback.email}?subject=Re: ${feedback.subject}`}>
                                    <Button variant="outline" className="w-full border-[#e6e0db] text-[#8a7560] hover:text-[#181411] rounded-xl font-bold flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Reply via Email
                                    </Button>
                                </a>
                                <form action={async () => {
                                    "use server"
                                    await deleteFeedback(feedback.id)
                                }}>
                                    <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}

                {(!feedbacks || feedbacks.length === 0) && (
                    <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] p-20 text-center">
                        <div className="h-20 w-20 rounded-full bg-[#f8f7f5] flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="h-10 w-10 text-[#e6e0db]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#181411]">No feedback yet</h3>
                        <p className="text-[#8a7560] mt-2">When customers send messages, they'll appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
