export const settingsQuery = `
  *[_type == "settings"][0]{
    title,
    description,
    author,
    profile,
    email,
    twitter,
    github,
    ogImage,
    message,
    content,
    website,
  }
`;

export const pageQuery = `
  *[_type == "page" && slug.current == $slug][0]{
    title,
    slug,
    content
  }
`;

export const postquery = `
  *[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    content,
    tags[]-> {
      title,
      slug
    },
  }
`;