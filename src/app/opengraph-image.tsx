import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION, EVENT_DATE } from "~/lib/constants";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";

// Function to load font with error handling
async function loadFont(fontPath: string): Promise<Buffer> {
  try {
    const fontData = readFileSync(fontPath);
    return fontData;
  } catch (error) {
    // Fallback to loading from absolute path
    try {
      const absolutePath = join(
        __dirname,
        "..",
        "..",
        "public",
        "fonts",
        fontPath.split("/").pop()!
      );
      return readFileSync(absolutePath);
    } catch (fallbackError) {
      throw new Error(`Failed to load font ${fontPath}: ${error}`);
    }
  }
}

// Create reusable options object
let imageOptions: any = null;

// Initialize fonts
async function initializeFonts() {
  if (imageOptions) return imageOptions;

  try {
    const regularFont = await loadFont(
      join(process.cwd(), "public/fonts/Nunito-Regular.ttf")
    );
    const semiBoldFont = await loadFont(
      join(process.cwd(), "public/fonts/Nunito-SemiBold.ttf")
    );

    imageOptions = {
      width: 1200,
      height: 800,
      fonts: [
        {
          name: "Nunito",
          data: regularFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Nunito",
          data: semiBoldFont,
          weight: 600,
          style: "normal",
        },
      ],
    };

    return imageOptions;
  } catch (error) {
    throw error;
  }
}

// Function to format date in a MySpace-style way
function formatMySpaceDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  return date.toLocaleDateString('en-US', options);
}

export default async function Image() {
  const options = await initializeFonts();

  // MySpace-inspired colors
  const BACKGROUND_COLOR = "#eef5ff";
  const BORDER_COLOR = "#6699cc";
  const ACCENT_COLOR = "#ff0066";

  /*
this Image is rendered using vercel/satori.

Satori supports a limited subset of HTML and CSS features, due to its special use cases. In general, only these static and visible elements and properties that are implemented.
For example, the <input> HTML element, the cursor CSS property are not in consideration. And you can't use <style> tags or external resources via <link> or <script>.
Also, Satori does not guarantee that the SVG will 100% match the browser-rendered HTML output since Satori implements its own layout engine based on the SVG 1.1 spec.
Please refer to Satori’s documentation for a list of supported HTML and CSS features. https://github.com/vercel/satori#css
*/
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-center items-center relative"
        style={{
          backgroundColor: BACKGROUND_COLOR,
          border: `10px solid ${BORDER_COLOR}`,
          borderRadius: '20px',
          padding: '40px',
        }}
      >
        <div tw="flex flex-col items-center" style={{ 
          backgroundColor: 'white',
          border: `5px solid ${ACCENT_COLOR}`,
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '10px 10px 0px rgba(0, 0, 0, 0.2)'
        }}>
          <div tw="text-6xl font-bold mb-6" style={{ color: ACCENT_COLOR }}>
            ✨ {PROJECT_TITLE} ✨
          </div>
          
          <div tw="text-3xl mb-8" style={{ color: '#333' }}>
            {PROJECT_DESCRIPTION}
          </div>
          
          <div tw="text-2xl mb-4" style={{ color: '#3366cc' }}>
            Join us on {formatMySpaceDate(EVENT_DATE)}
          </div>
          
          <div tw="flex justify-center mt-6">
            <div tw="px-6 py-3 text-xl" style={{ 
              backgroundColor: ACCENT_COLOR,
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              ⭐ Don&apos;t miss it! ⭐
            </div>
          </div>
        </div>
      </div>
    ),
    options
  );
}
