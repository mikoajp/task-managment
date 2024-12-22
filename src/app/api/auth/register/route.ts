import { NextResponse } from 'next/server';

const API_URL = 'https://recruitment-task.jakubcloud.pl';

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        }
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Sending registration data:', body);

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                login: body.login,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName
            })
        });

        const data = await response.json();
        const status = response.status;

        console.log('API response:', { status, data });

        if (!response.ok) {
            return NextResponse.json(data, { status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Registration failed' },
            { status: 500 }
        );
    }
}