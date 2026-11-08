export interface AppProps {
  title?: string;
}

export function App({ title = 'fixture-react' }: AppProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}
