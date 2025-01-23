export function createGoogleAuthorLink(author = "") {
  const normalizedAuthor = encodeURIComponent(author.trim() + " author");
  return `https://www.google.com/search?q=${normalizedAuthor}`;
}

export function createGooglePublisherLink(pub) {
  const normalizedPublisher = encodeURIComponent(pub.trim() + " publisher");
  return `https://www.google.com/search?q=${normalizedPublisher}`;
}
