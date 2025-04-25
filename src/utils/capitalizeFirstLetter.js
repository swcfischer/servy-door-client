export default function capitalizeFirstLetter(word = "No word provided") {
  const newWord = word.trim();
  const firstLetter = word[0];
  return firstLetter.toUpperCase() + newWord.slice(1);
}

export function removeHtmlTags(str) {
  if (!str) {
    return;
  }
  return str.replace(/^```html|```$/g, "").replace(/```/g, "");
}
