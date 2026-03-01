import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const formUrl = process.env.GOOGLE_FORM_SUBMIT_URL;
        const emailEntryId = process.env.GOOGLE_FORM_EMAIL_ENTRY_ID; // e.g., 'entry.123456789'

        if (!formUrl || !emailEntryId) {
            console.error('Missing Google Form environment variables');
            // Always return success to the user so they don't see a server error if the admin hasn't configured the sheet yet
            return NextResponse.json({ success: true, warning: 'Emails not configured on backend yet.' });
        }

        // Prepare the form data to simulate a real Google Form submission
        const formData = new URLSearchParams();
        formData.append(emailEntryId, email);

        // Submit the data to Google Forms
        const response = await fetch(formUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            console.error('Google Form submission failed:', response.statusText);
            // Even if Google rejects it (e.g. CORS on their end for direct POST), we often still record the entry.
        }

        return NextResponse.json({ success: true, message: 'Waitlist joined successfully.' });
    } catch (error) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
