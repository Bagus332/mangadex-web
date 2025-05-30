    // src/app/api/md-proxy/[...slug]/route.ts

    import { NextRequest, NextResponse } from 'next/server';

    const MANGADEX_API_BASE_URL = 'https://api.mangadex.org';

    export async function GET(
      request: NextRequest,
      { params }: { params: { slug: string[] } }
    ) {
      const targetPath = params.slug.join('/');
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
          // cache: 'no-store', // Sesuaikan kebijakan caching jika perlu
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
          return NextResponse.json(
            data || { message: `Error from MangaDex API: ${apiResponse.statusText}` },
            { status: apiResponse.status }
          );
        }

        const response = NextResponse.json(data, {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
        });
        // Anda bisa menyalin header tertentu dari apiResponse ke response jika perlu
        return response;

      } catch (error: any) {
        console.error(`[API Proxy] Internal error proxying to ${targetUrl}:`, error);
        return NextResponse.json(
          { message: 'Internal Server Error while proxying request', error: error.message },
          { status: 500 }
        );
      }
    }

    // Tambahkan handler untuk metode lain (POST, dll.) jika diperlukan
    