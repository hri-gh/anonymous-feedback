import { signIn } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleDemoLogin = async (router: AppRouterInstance, toast: any, setIsLoading?: (loading: boolean) => void) => {
    if (setIsLoading) setIsLoading(true);

    const result = await signIn('credentials', {
        redirect: false,
        identifier: 'demo_user', // Your DB values
        password: 'demo123',
    });

    if (setIsLoading) setIsLoading(false);

    if (result?.error) {
        toast({
            title: 'Demo Access Failed',
            description: result.error === 'CredentialsSignin' ? 'Invalid demo credentials' : result.error,
            variant: 'destructive',
        });
    } else {
        router.replace('/dashboard');
    }
};
