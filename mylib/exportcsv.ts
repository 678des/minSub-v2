//DBは食材を管理するだけ。ユーザが入力したデータはcsvで。
export function exportCSV(
  data: {
    id: number;
    gram: number;
  }[],
) {
  //const csvData = csvText.split("\n").map((row) => row.split(","));
  let csvContent = "食材id,摂取グラム,\n";
  Object.values(data).map((nut) => {
    console.log(nut.id, nut.gram, "23ああ");
    csvContent += `${nut.id}, ${nut.gram}\n`;
  });
  console.log(csvContent);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ypurIngredients.csv";
  link.click();
}

/** 書籍データの型 */
interface BookType {
  title: string;
  author: string;
  publishedYear: number;
}

/** CSVヘッダー */
const CSV_HEADERS = ["タイトル", "著者", "出版年"];

/** 書籍データをCSV形式の文字列に変換する */
export const convertToCsvRows = (items: BookType[]) => {
  const header = CSV_HEADERS.join(",");
  const rows = items.map((item) => {
    return [item.title, item.author, item.publishedYear].join(",");
  });
  return [header, ...rows].join("\n");
};

console.log("hello world");
