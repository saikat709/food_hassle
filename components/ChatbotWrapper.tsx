'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FloatingChatbot from './FloatingChatbot';

export default function ChatbotWrapper() {
    const { data: session, status } = useSession();
    const [userId, setUserId] = useState<string | null>(null);

    console.log("Hello there!!!!!!!!1");

    useEffect(() => {
        // Get user ID from NextAuth session
        if (status === 'authenticated' && session?.user?.id) {
            setUserId(session.user.id);
        } else {
            setUserId(null);
        }
    }, [session, status]);

    // Don't render chatbot if user is not logged in or still loading
    if (status === 'loading' || !userId) {
        return null;
    }

    return <FloatingChatbot userId={userId} />;
}
