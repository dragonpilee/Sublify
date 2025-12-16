/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                cine: {
                    900: '#0a0a0a',
                    800: '#121212',
                    700: '#1a1a1a',
                    600: '#262626',
                    500: '#404040',
                    accent: '#e50914', // Netflix/Cinema Red
                    blue: '#56CCF2',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
