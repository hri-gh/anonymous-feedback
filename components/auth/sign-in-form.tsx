"use client"

import React, { useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// COMPONENTS IMPORT
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast"

// OTHERS UTILS IMPORT
import { SignInSchema } from '@/schemas';
import { Loader2 } from 'lucide-react'
import { handleDemoLogin } from '@/lib/demo-login';


export const SignInForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });


    const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
        setIsSubmitting(true);

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        // console.log('result:',result);


        setIsSubmitting(false);
        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login Failed',
                    description: 'Incorrect username or password',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        }
        if (result?.url) {
            router.replace('/dashboard');
        }
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-sans font-extrabold tracking-tight lg:text-5xl mb-6">
                            Welcome Back to <span className="">Feedback<span className="text-blue-600">X</span></span>
                        </h1>
                        <p className="mb-4">Sign in to continue your secret conversations</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email/Username</FormLabel>
                                        <Input {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Not a member yet?{' '}
                            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-2 border-t pt-4">
                        <button
                            onClick={() => handleDemoLogin(router, toast, setIsSubmitting)}
                            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors "
                        >
                            Prefer a quick look? <span className="underline">Try Demo Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

}
