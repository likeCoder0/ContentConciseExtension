import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { generateStructuredData } from './transcriptUtils.js';

export default function Chat({ info: { transcript, metadata, youtube_url } }) {
    const [scrapedComments, setScrapedComments] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Track if a request is in progress
    const isRequestInProgress = useRef(false);

    // Generate structured data from metadata description and transcript
    const structuredData = generateStructuredData(metadata.description, transcript);
    let transcriptText;

    // Format time from seconds
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = (seconds % 60).toFixed(2);

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
    }

    // Parse transcript into readable text with timestamps
    const parsedTranscript = transcript.events
        .filter(event => event.segs) // Filter valid segments
        .map(event => {
            const starttime = formatTime(event.tStartMs / 1000);
            const endtime = formatTime((event.tStartMs + event.dDurationMs) / 1000);
            const text = event.segs.map(segment => segment.utf8).join(' ');
            return `${starttime}-${endtime} - ${text}`;
        })
        .join('\n')
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove invalid characters
        .replace(/\s+/g, ' '); // Replace multiple spaces with a single space

    // Use structured data if available, else use plain transcript
    if (!structuredData || structuredData.length === 0) {
        console.error('No timestamps found in the description.');
        transcriptText = parsedTranscript;
    } else {
        console.log('Structured data generated successfully.');
        transcriptText = structuredData.map(entry => entry).join('\n');
    }

    // Fetch comments using YouTube URL
    const fetchScrapedComments = async () => {
        if (isRequestInProgress.current) return; // Prevent duplicate requests

        setLoading(true);
        console.log('Fetching comments for URL:', youtube_url);
        try {
            isRequestInProgress.current = true; // Mark request as in progress
            const response = await fetch('http://localhost:5000/scrap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ youtube_url }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Comments fetched:', data);

            if (data && data.video_title && data.video_owner) {
                setScrapedComments(data);
            } else {
                console.error('Invalid data format received:', data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            isRequestInProgress.current = false; // Mark request as complete
            setLoading(false);
        }
    };

    // Fetch comments when youtube_url changes
    useEffect(() => {
        if (youtube_url) {
            fetchScrapedComments();
        } else {
            console.error("No youtube_url provided.");
        }
    }, [youtube_url]);

    useEffect(() => {
        console.log('isActive:', isActive);
    }, [isActive]);

    // UseChat hook
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: isActive ? "http://127.0.0.1:5000/chat" : "http://localhost:3000/api/chat",
        headers: isActive ? { "Content-Type": "application/json" } : {},
        initialMessages: [
            {
                id: '0',
                role: 'system',
                content: [
                    'START OF QUERY INSTRUCTIONS',
                    'You are a helpful assistant. Given the metadata and transcript of a YouTube video, your purpose is to answer any questions that follow.',
                    'END OF QUERY INSTRUCTIONS',
                    '',
                    'START OF SUMMARY INSTRUCTIONS',
                    'When asked to summarize the video:',
                    '- Provide a detailed summary that covers the main points.',
                    '- Include timestamps from the transcript where possible to indicate when key events or topics occur.',
                    '(starttime - endtime) title :\n summary \n',
                    'END OF SUMMARY INSTRUCTIONS',
                    '',
                    'START OF METADATA',
                    `Author: ${metadata.author}`,
                    `Title: ${metadata.title}`,
                    'END OF METADATA',
                    '',
                    'START OF TRANSCRIPT',
                    transcriptText,
                    'END OF TRANSCRIPT',
                ].join('\n'),
            },
        ],
        onError: (error) => {
            console.error("API error:", error);
            // Handle the error (e.g., show a message to the user)
        }
    });

    // Scroll to the bottom of the conversation container
    const conversationContainer = useRef(null);
    useEffect(() => {
        const elem = conversationContainer.current;
        if (elem) {
            elem.scrollTo({ top: elem.scrollHeight });
        }
    }, [messages]);

    return (
        <div className="chat-with-youtube-container">
            <div className="cwy-label">Chat with YouTube</div>
            <div ref={conversationContainer} className="cwy-conversation-container">
            {messages
                .filter(message => message.role !== 'system')
                .map(message => {
                    // Remove all double quotes
                    let content = message.content.replace(/"/g, ''); // Remove all quotes
                    
                    return (
                        <div key={message.id} className={`message message-${message.role}`} >
                            {content}
                        </div>
                    );
                })}

                {loading && <div>Loading comments...</div>}
                {scrapedComments && <div>Scraped Comments</div>}
            </div>
            <form className="cwy-form" onSubmit={handleSubmit}>
                <input
                    className="cwy-textbox"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
            </form>
            <button
                onClick={() => setIsActive(!isActive)}
                className={`button ${isActive ? 'button-active' : 'button-inactive'}`}
            >
                {isActive ? 'Comment Chat' : 'Video Chat'}
            </button>
        </div>
    );
}
