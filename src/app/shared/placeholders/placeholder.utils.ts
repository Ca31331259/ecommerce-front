export function resolveImage(

    url: string | null | undefined,

    fallback: string

): string {

    if (!url) {

        return fallback;

    }

    if (!url.trim()) {

        return fallback;

    }

    return url;

}