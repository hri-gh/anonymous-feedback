"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ShieldCheck, MessageSquare, Zap } from 'lucide-react'

export const DemoPage = () => {
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);

        // Hardcoded Demo Credentials
        const result = await signIn('credentials', {
            redirect: false,
            identifier: 'demo_user',
            password: 'demo123',
        });

        if (result?.error) {
            toast({
                title: 'Demo Access Failed',
                description: 'Please try again later.',
                variant: 'destructive',
            });
            setIsDemoLoading(false);
        } else {
            router.replace('/dashboard');
        }
    };

    return (
        <>
            <main className="min-h-screen rounded-t-2xl bg-slate-950 text-white selection:bg-blue-500/30">
                {/* Hero Section */}
                < div className="flex flex-col items-center justify-center px-6 pt-24 pb-12 text-center max-w-5xl mx-auto" >
                    <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 mb-6">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Secure & Anonymous Feedback
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                        Welcome to <span className="text-blue-500">Feedback<span className="text-white">X</span></span>
                    </h1>

                    {/* <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        feedback<span className="text-blue-500">.</span>x
                    </h1> */}

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
                        A platform where honest conversations happen. Get anonymous insights,
                        manage your messages, and interact with your audience privately.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Main Call to Action: Demo Button */}
                        <Button
                            size="lg"
                            onClick={handleDemoLogin}
                            disabled={isDemoLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                        >
                            {isDemoLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                            )}
                            Login as Demo User
                        </Button>

                        {/* Standard Login/Sign-up */}
                        <Link href="/sign-in">
                            <Button size="lg" className="px-8 h-12 text-lg border-slate-700 hover:bg-slate-800 text-slate-100">
                                Sign In Manually
                            </Button>
                        </Link>
                    </div>
                </div >

                {/* Feature Grid (Optional - adds professional touch) */}
                < div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto mt-12 mb-10 border-t border-slate-900 pt-16" >
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <MessageSquare className="h-8 w-8 text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Anonymous Messaging</h3>
                        <p className="text-slate-400">Receive feedback from anyone without knowing who they are.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <Zap className="h-8 w-8 text-yellow-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">AI Suggestions</h3>
                        <p className="text-slate-400">Leverage AI-powered suggestions to generate
                            feedbacks.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <ShieldCheck className="h-8 w-8 text-green-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Secure Dashboard</h3>
                        <p className="text-slate-400">Full control over your public profile and incoming message flow.</p>
                    </div>
                </div >
            </main>
        </>
    );
}
