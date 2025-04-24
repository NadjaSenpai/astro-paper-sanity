import slugify from '@/utils/slugify';

export function renderBlock({ children, value }: any) {
  if (isEmpty(children)) return null;

  // generate an `id` from text to use for heading links
  const text = Array.isArray(children)
    ? children.map(c => (typeof c === 'string' ? c : '')).join('')
    : typeof children === 'string'
    ? children
    : '';
  const id = slugify(text);

  switch (value.style) {
    case 'h1':
      return (
        <h1 id={id} className="text-4xl font-bold mb-4 group">
          {children}
          <a
            href={`#${id}`}
            className="heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-hidden="true"
          >
            #
          </a>
        </h1>
      );
    case 'h2':
      return (
        <h2 id={id} className="text-3xl font-bold mb-3 group">
          {children}
          <a
            href={`#${id}`}
            className="heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-hidden="true"
          >
            #
          </a>
        </h2>
      );
    case 'h3':
      return <h3 className="text-2xl font-bold mb-2">{children}</h3>;
    case 'h4':
      return <h4 className="text-xl font-bold mb-1">{children}</h4>;
    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
          {children}
        </blockquote>
      );
    default:
      return <p className="mb-4">{children}</p>;
  }
}

function isEmpty(children: React.ReactNode) {
  if (Array.isArray(children)) {
    return children.every(
      (c) => typeof c === 'string' && (c.trim() === '' || c.trim() === '#')
    );
  }
  return typeof children === 'string' && (children.trim() === '' || children.trim() === '#');
}
