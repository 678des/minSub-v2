//食材の情報をimport
import { ingredients } from "../data/ingredients";

//それぞれの食材を何グラムとったかを計算するために一時保存する辞書
let tempIntakeIngrDict: { [key: number]: string } = { 0: "" };

//栄養素を何グラムとったのか、それぞれの合計値や基本情報を保存する辞書
let nutInfo = [
  {
    id: "energy",
    name: "エネルギー",
    unit: "kcal",
    min: 2600,
    max: 2800,
    intake: 0,
  },
  {
    id: "protein",
    name: "タンパク質",
    unit: "g",
    min: 65,
    max: 195,
    intake: 0,
  },
  { id: "lipid", name: "脂質", unit: "g", min: 57.8, max: 173.4, intake: 0 },
  {
    id: "fattyAcids",
    name: "飽和脂肪酸",
    unit: "g",
    min: 7,
    max: 20.2,
    intake: 0,
  },
  {
    id: "cholesterol",
    name: "コレステロール",
    unit: "mg",
    min: 1,
    max: 200,
    intake: 0,
  },
  {
    id: "carbohydrates",
    name: "炭水化物",
    unit: "g",
    min: 325,
    max: 975,
    intake: 0,
  },
  {
    id: "dietaryFiber",
    name: "食物繊維",
    unit: "g",
    min: 23,
    max: 115,
    intake: 0,
  },
  {
    id: "vitaminA",
    name: "ビタミンA",
    unit: "μgRAE",
    min: 900,
    max: 2700,
    intake: 0,
  },
  {
    id: "vitaminD",
    name: "ビタミンD",
    unit: "μg",
    min: 11.0,
    max: 100,
    intake: 0,
  },
  {
    id: "vitaminE",
    name: "ビタミンE",
    unit: "mg",
    min: 7.0,
    max: 900,
    intake: 0,
  },
  {
    id: "vitaminK",
    name: "ビタミンK",
    unit: "μg",
    min: 150,
    max: 750,
    intake: 0,
  },
  {
    id: "vitaminB1",
    name: "ビタミンB1",
    unit: "mg",
    min: 1.4,
    max: 50,
    intake: 0,
  },
  {
    id: "vitaminB2",
    name: "ビタミンB2",
    unit: "mg",
    min: 1.6,
    max: 50,
    intake: 0,
  },
  {
    id: "niacin",
    name: "ナイアシン",
    unit: "mgNE",
    min: 15,
    max: 350,
    intake: 0,
  },
  {
    id: "vitaminB6",
    name: "ビタミンB6",
    unit: "mg",
    min: 1.5,
    max: 55,
    intake: 0,
  },
  {
    id: "vitaminB12",
    name: "ビタミンB12",
    unit: "μg",
    min: 2.4,
    max: 1000,
    intake: 0,
  },
  { id: "folicAcid", name: "葉酸", unit: "μg", min: 240, max: 1000, intake: 0 },
  {
    id: "pantothenicAcid",
    name: "パントテン酸",
    unit: "mg",
    min: 5,
    max: 250,
    intake: 0,
  },
  { id: "biotin", name: "ビオチン", unit: "μg", min: 50, max: 2500, intake: 0 },
  {
    id: "vitaminC",
    name: "ビタミンC",
    unit: "mg",
    min: 100,
    max: 2000,
    intake: 0,
  },
  { id: "Na", name: "ナトリウム", unit: "mg", min: 2870, max: 5740, intake: 0 },
  { id: "K", name: "カリウム", unit: "mg", min: 3000, max: 9000, intake: 0 },
  { id: "Ca", name: "カルシウム", unit: "mg", min: 800, max: 2500, intake: 0 },
  {
    id: "Mg",
    name: "マグネシウム",
    unit: "mg",
    min: 340,
    max: 1000,
    intake: 0,
  },
  { id: "P", name: "リン", unit: "mg", min: 1000, max: 3000, intake: 0 },
  { id: "Fe", name: "鉄", unit: "mg", min: 7.5, max: 40, intake: 0 },
  { id: "Zn", name: "亜鉛", unit: "mg", min: 12, max: 40, intake: 0 },
  { id: "Cu", name: "銅", unit: "mg", min: 0.9, max: 7, intake: 0 },
  { id: "Mn", name: "マンガン", unit: "mg", min: 4.0, max: 11, intake: 0 },
  { id: "I", name: "ヨウ素", unit: "μg", min: 130, max: 3000, intake: 0 },
  { id: "Se", name: "セレン", unit: "μg", min: 30, max: 420, intake: 0 },
  { id: "Cr", name: "クロム", unit: "μg", min: 10, max: 500, intake: 0 },
  { id: "Mo", name: "モリブデン", unit: "μg", min: 30, max: 600, intake: 0 },
  {
    id: "saltEquivalent",
    name: "食塩相当量",
    unit: "g",
    min: 1,
    max: 7.3,
    intake: 0,
  },
];
export function myCalculate(data: { id: number; gram: any }) {
  //console.log(data);
  const id = data.id as keyof typeof tempIntakeIngrDict;
  tempIntakeIngrDict[id] = data.gram;
  //非効率だが、計算を実行するたびにすべてを計算しなおす
  //////////tempIntakeIngrDict[3] = "50";
  //合計値段を初期化
  let sumPrice: number = 0;
  //栄養素の合計を初期化
  for (const [id, obj] of Object.entries(nutInfo)) {
    obj.intake = 0;
  }

  for (const [id, gram] of Object.entries(tempIntakeIngrDict)) {
    //idから食材を参照し、摂取量から値段を計算
    const g = Number(gram);
    const ingrData = ingredients.find((i) => i.id == Number(id));
    const ingrPrice = ingrData?.price;
    sumPrice += (ingrPrice || 0) * (g / 100);

    //その食材の34栄養素をそれぞれ調べる
    for (const [id, obj] of Object.entries(nutInfo)) {
      // 1gあたりの栄養素
      let gramNut = Number(ingrData?.[obj.id as keyof typeof ingrData]) / 100;
      if (isNaN(gramNut)) {
        gramNut = 0;
      }
      obj.intake = (Number.isNaN(obj.intake) ? 0 : obj.intake) + gramNut * g;
    }
  }

  //二十ループで全通り34栄養素*100食材 = 3400回のループ
  //ここは栄養素
  console.log("計算", nutInfo);
  return { nutInfo, sumPrice };
}
