import { NextResponse } from 'next/server';

const API_URL = 'https://recruitment-task.jakubcloud.pl';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json(
                { message: 'Authorization header is required' },
                { status: 401 }
            );
        }

        const requestBody = await request.json();

        const response = await fetch(`${API_URL}/pockets`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Error parsing response JSON:', error);
            data = { message: 'Invalid response from external API' };
        }

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            { message: 'Failed to create pocket' },
            { status: 500 }
        );
    }
}
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json(
                { message: 'Authorization header is required' },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_URL}/pockets`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Error parsing response JSON:', error);
            data = { message: 'Invalid response from external API' };
        }

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json(
            { message: 'Failed to fetch pockets' },
            { status: 500 }
        );
    }
}
export async function DELETE(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json(
                { message: 'Authorization header is required' },
                { status: 401 }
            );
        }

        // Pobierz `id` z URL
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        if (!id) {
            return NextResponse.json(
                { message: 'Pocket ID is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_URL}/pockets/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        return NextResponse.json({ message: `Pocket with ID ${id} deleted successfully` });
    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json(
            { message: 'Failed to delete pocket' },
            { status: 500 }
        );
    }
}