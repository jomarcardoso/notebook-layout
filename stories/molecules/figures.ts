// notebook-layout/stories/molecules/figures.ts

// Desenhos de exemplo. O design system define lugar, tamanho e como a cor pousa
// no papel; o desenho e sempre do app.
const svg = (viewBox: string, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`,
  )}`;

const figure = (body: string) => svg('0 0 32 32', body);

export const figures = {
  farinha: figure(
    '<path d="M9 28h14l-2-17H11z" fill="#efe3c8" stroke="#9c7b4a" stroke-width="1.5"/><path d="M11 11c2-4 8-4 10 0" fill="none" stroke="#9c7b4a" stroke-width="1.5"/>',
  ),
  acucar: figure(
    '<rect x="8" y="10" width="16" height="16" fill="#fbfaf6" stroke="#8a8a8a" stroke-width="1.5"/><path d="M8 15h16" stroke="#6d9bc3" stroke-width="2"/>',
  ),
  ovo: figure(
    '<ellipse cx="16" cy="17" rx="9" ry="11" fill="#f3e6cf" stroke="#b08a57" stroke-width="1.5"/>',
  ),
  queijo: figure(
    '<path d="M4 25 28 13v12z" fill="#f2c14e" stroke="#b98a1c" stroke-width="1.5"/><circle cx="20" cy="20" r="1.8" fill="#d9a22e"/>',
  ),
  tomate: figure(
    '<circle cx="16" cy="18" r="10" fill="#d9573b"/><path d="M11 9l5 3 5-3" fill="none" stroke="#4f8a3a" stroke-width="2"/>',
  ),
};

const photo = (ground: string, plate: string, food: string) =>
  svg(
    '0 0 120 120',
    `<rect width="120" height="120" fill="${ground}"/><circle cx="60" cy="64" r="40" fill="${plate}"/><circle cx="60" cy="64" r="24" fill="${food}"/>`,
  );

export const photos = {
  bolo: photo('#c9a27a', '#f4efe6', '#a0522d'),
  torta: photo('#7c8c6a', '#efe9dd', '#e2b04a'),
  sopa: photo('#5b6b7a', '#f1ede4', '#d9573b'),
  pao: photo('#b58b5b', '#ece4d4', '#c68a3f'),
  salada: photo('#8c9a7c', '#f3efe7', '#6aa84f'),
  pudim: photo('#a67c67', '#f2ece2', '#d9a441'),
};
