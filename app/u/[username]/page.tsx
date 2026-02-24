'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useCompletion } from 'ai/react';


// COMPONENTS
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';


// OTHER UTILS
import { Loader2 } from 'lucide-react';
import { ApiResponse } from '@/types/api-response';
import { MessageSchema } from '@/schemas';

const specialChar = '||';

// const parseStringMessages = (messageString: string): string[] => {
//   return messageString.split(specialChar);
// };

const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];
  return messageString
    .split(specialChar)
    .map((s) => s.trim())
    .filter(Boolean);
};

const initialMessageString =
  "I really liked the overall structure of your portfolio and how easy it is to explore.||It might be helpful to add more details about the technologies used in each project.||Highlighting the impact or results of your work could make the projects even stronger.||Your projects are interesting, and expanding on your problem-solving approach would make them stand out more.";
export default function SendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedString, setSuggestedString] = useState<string | null>(null);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // session-only history of sent messages (most recent first)
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  const params = useParams<{ username: string }>();
  const username = params.username;

  // const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading,
  //   error,
  // } = useCompletion({
  //   api: '/api/suggest-messages',
  //   initialCompletion: initialMessageString,
  // });


  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  // New: call API to get suggested messages
  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true);
      setSuggestError(null);

      const res = await axios.post('/api/suggest-messages', {}); // route expects POST
      // route returns a JSON string (e.g. "q1||q2||q3")
      const text =
        typeof res.data === 'string' ? res.data : (res.data as any).text ?? '';

      setSuggestedString(text || initialMessageString);
    } catch (err) {
      console.error('Error fetching messages:', err);
      const axiosErr = err as AxiosError;
      const msg =
        (axiosErr?.response?.data as { error?: string })?.error ??
        axiosErr?.response?.data ??
        axiosErr?.message ??
        String(err);
      setSuggestError(String(msg));
    } finally {
      setIsSuggestLoading(false);
    }
  };


  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });

      // Add the sent message to session history
      if (data.content && data.content.trim()) {
        setSentMessages((prev) => [data.content.trim(), ...prev]);
      }
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchSuggestedMessages = async () => {
  //   try {
  //     // complete('');

  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //     // Handle error appropriately
  //   }
  // };

  return (
    <>
      <div className="mx-auto my-8 p-6 bg-white rounded">
        <div className="flex gap-10">
          {/* Left: session history */}
          <aside className="w-80 bg-slate-300 p-2 rounded-lg">
            <Card className='rounded-md'>
              <CardHeader >
                <h3 className="text-lg font-semibold">Message History</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2 max-h-[60vh] overflow-auto">
                {sentMessages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages sent yet.</p>
                ) : (
                  sentMessages.map((m, i) => (
                    <div
                      key={i}
                      className="p-2 rounded border text-sm break-words bg-gray-50"
                    >
                      {m}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Right: existing form + suggestions */}
          <main className="flex-1 bg-slate-100 p-4 rounded-lg">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Public Profile Link
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading || !messageContent}>
                      Send It
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            <div className="space-y-4 my-8">
              <div className="space-y-2">
                <Button
                  onClick={fetchSuggestedMessages}
                  className="my-4"
                  disabled={isSuggestLoading}
                >
                  {isSuggestLoading ? 'Generating...' : 'Suggest Messages'}
                </Button>
                <p>Click on any message below to select it.</p>
              </div>
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Messages</h3>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                  {suggestError ? (
                    <p className="text-red-500">{suggestError}</p>
                  ) : (
                    parseStringMessages(suggestedString ?? initialMessageString).map(
                      (message, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="mb-2"
                          onClick={() => handleMessageClick(message)}
                        >
                          {message}
                        </Button>
                      ),
                    )
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator className="my-6" />
            <div className="text-center">
              <div className="mb-4">Get Your Message Board</div>
              <Link href={'/sign-up'}>
                <Button>Create Your Account</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
