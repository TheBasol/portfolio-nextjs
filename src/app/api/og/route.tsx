import { ImageResponse } from 'next/og';
import { getNoteBySlug } from '@/lib/mdx';
import { NoteOgTemplate } from '@/components/seo/NoteOgTemplate';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slugParam = searchParams.get('slug');

    const slugParts = slugParam ? slugParam.split('/') : [];
    const note = slugParts.length > 0 ? getNoteBySlug(slugParts) : null;

    const title = note?.frontmatter.title || 'Technical Note';
    const description =
      note?.frontmatter.description ||
      'Engineering notes and architecture thoughts by Enrique Vazquez.';
    const date = note?.frontmatter.date || '2026';
    const tags = note?.frontmatter.tags || ['Engineering', 'Architecture'];

    return new ImageResponse(
      (
        <NoteOgTemplate
          title={title}
          description={description}
          date={date}
          tags={tags}
        />
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}
