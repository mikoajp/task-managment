import { NextResponse } from 'next/server';
import {API_URL} from "@/lib/api";

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json(
                { message: 'Authorization header is required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const pocketId = request.url.split('/').slice(-2)[0];
        const response = await fetch(`${API_URL}/pockets/${pocketId}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json(
            { message: 'Failed to add task' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json(
                { message: 'Authorization header is required' },
                { status: 401 }
            );
        }

        const urlSegments = request.url.split('/');
        const pocketId = urlSegments[urlSegments.length - 3]; // `pockets/:pocketId/tasks/:taskId`
        const taskId = urlSegments[urlSegments.length - 1];

        if (!pocketId || !taskId) {
            return NextResponse.json(
                { message: 'Pocket ID and Task ID are required in the URL' },
                { status: 400 }
            );
        }

        const body = await request.json();


        const response = await fetch(
            `${API_URL}/pockets/${pocketId}/tasks/${taskId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in PUT handler:', error);
        return NextResponse.json(
            { message: 'Failed to update task' },
            { status: 500 }
        );
    }
}