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
    // ...他のフィールド
    content[]{
      ...,                       // blockの基本フィールド
      _type == "image" => {      // imageノードのときだけ
        asset->{_id, url},       // 必要ならasset情報
        alt,
        caption,
        alignment,               // ここが必須！
        width                     // ここも必須！
      }
    }
}`;

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