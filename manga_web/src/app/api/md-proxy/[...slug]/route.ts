// src/app/api/md-proxy/[...slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { RouteContext } from 'next'; // Tambahkan baris ini

const MANGADEX_API_BASE_URL = 'https://api.mangadex.org';

// Hapus interface RouteHandlerContext jika tidak digunakan di tempat lain,
// atau biarkan jika Anda memiliki penggunaan lain untuk itu.
// interface RouteHandlerContext {
//   params: {
//     slug: string[];
//   };
// }

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  // Tunggu params sebelum digunakan
  const { slug } = await context.params;
  const targetPath = slug.join('/');

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  const targetUrl = `${MANGADEX_API_BASE_URL}/${targetPath}${queryString ? `?${queryString}` : ''}`;

  console.log(`[API Proxy] Forwarding GET request to: ${targetUrl}`);

  try {
    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store', // Sesuaikan kebijakan caching
    });

    let data;
    const contentType = apiResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await apiResponse.json();
    } else {
      data = await apiResponse.text();
    }

    if (!apiResponse.ok) {
      console.error(`[API Proxy] Error from MangaDex API (${targetUrl}): ${apiResponse.status}`, data);
      const errorPayload = (typeof data === 'object' && data !== null) ? data : { message: data || `Error from MangaDex API: ${apiResponse.statusText}` };
      return NextResponse.json(
        errorPayload,
        { status: apiResponse.status }
      );
    }

    const successPayload = (typeof data === 'object' && data !== null) ? data : { data: data };
    const response = NextResponse.json(successPayload, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
    });

    return response;

  } catch (error: any) {
    console.error(`[API Proxy] Internal error proxying to ${targetUrl}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error while proxying request', error: error.message },
      { status: 500 }
    );
  }
}

// Jika Anda memiliki handler POST atau lainnya, terapkan pola yang sama untuk parameter kedua:
// export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }): Promise<NextResponse> { /* ... */ }
