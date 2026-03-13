import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasteEditor: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error('You must be logged in to create a paste.');
            return;
        }

        try {
            const response = await fetch('/api/pastes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({ title, content, visibility }),
            });

            if (!response.ok) {
                throw new Error('Failed to create paste');
            }

            const data = await response.json();
            toast.success('Paste created successfully!');
            router.push(`/paste/${data.slug}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="paste-editor">
            <h2>Create a New Paste</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="visibility">Visibility:</label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <button type="submit">Create Paste</button>
            </form>
        </div>
    );
};

export default PasteEditor;