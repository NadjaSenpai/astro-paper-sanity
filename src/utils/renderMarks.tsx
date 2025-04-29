export function renderMarks({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { _type: string; href?: string };
}) {
  switch (value._type) {
    case "link":
      return (
        <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-accent underline">
          {children}
        </a>
      );
    default:
      return <>{children}</>;
  }
}