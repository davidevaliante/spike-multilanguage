/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#e81043',
                },
            },
            fontFamily: {
                sans: ['Raleway', 'sans-serif'],
                serif: ['Chango', 'serif'],
            },
        },
    },
    plugins: [],
}
