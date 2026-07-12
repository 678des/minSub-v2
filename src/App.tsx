import "./App.css";
import { exportCSV } from "../mylib/exportcsv";
//1:実際の入力欄の食材リストはdata.tsから表示するだけ。
import { ingredients } from "../data/ingredients";

//2:入力から受けとって、usestateで保存
//3:そのusestateの中身をすべて計算した結果を、さらに表示する
import { useState } from "react";
import { myCalculate } from "../mylib/calculation";

export default function App() {
  //ここはcalculate.tsで計算するが一時的にここに
  const [newprice, setnewprice] = useState<number>(0);
  const [intakeNuList, setIntakeNuList] = useState<
    {
      id: string;
      name: string;
      unit: string;
      min: number;
      max: number;
      intake: number;
    }[]
  >([]);

  //入力した数値の食材のIDと数値自体を保存する変数
  const [inputIngInfo, setinputIngInfo] = useState<
    {
      id: number;
      gram: number;
    }[]
  >([{ id: 0, gram: 0 }]);

  const selectIngrNameStyle = "font-bold text-black-600";
  const initIngrNameStyle = "font-bold text-gray-300";

  const subtitleSpaceStyle = "w-fit bg-gray-100";
  const priceStyle = "p-12 text-4xl text-yellow-700 bg-gray-100";

  function calcAndSetData(setData: { id: number; gram: number }) {
    const { nutInfo, sumPrice } = myCalculate(setData);
    setIntakeNuList([...nutInfo]);

    setnewprice(sumPrice);
  }

  return (
    <div className="flex flex-col flex-wrap">
      <div className={subtitleSpaceStyle}>
        <h2>食材</h2>{" "}
      </div>

      <div className="flex flex-col gap-2 px-12 pb-12 bg-gray-100">
        {ingredients.map((element, index) => (
          <div
            key={index}
            className="flex justify-between max-w-md  py-2 border-b border-gray-200"
          >
            {/*TODO　もしgramが入力されてなかったら、透明にするように*/}
            <div>
              <label
                className={
                  element.isSelected ? selectIngrNameStyle : initIngrNameStyle
                }
              >
                {element.name}
              </label>
            </div>
            <div className="flex gap-2">
              <input
                className="text-right"
                type="number"
                onChange={(e) => {
                  let gram = parseFloat(e.target.value) || 0;
                  gram = gram > 0 ? gram : 0;
                  element.isSelected = gram > 0;

                  const id = element.id;
                  const setData = {
                    id: id,
                    gram: gram,
                  };
                  // console.log("入力された値：", setData);

                  //csvを読み込むときもここで。
                  setinputIngInfo((prevList) => {
                    // 1. まず、指定された id がすでに配列内にあるかチェックする
                    const isExist = prevList?.some(
                      (item) => item.id === setData.id,
                    );

                    if (isExist) {
                      console.log("存");
                      // map を使って特定の要素だけを更新した「新しい配列」を返す
                      return prevList?.map((item) =>
                        item.id === setData.id
                          ? { ...item, gram: setData.gram }
                          : item,
                      );
                    } else {
                      console.log("新しく追加する1");
                      // スプレッド構文で、新しくオブジェクトを追加した「新しい配列」を返す
                      return [
                        ...prevList,
                        { id: setData.id, gram: setData.gram },
                      ];
                    }
                  });

                  calcAndSetData(setData);
                  //console.log(inputIngInfo);
                }}
              />
              <p>g</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b-1 border-gray-500 py-4" />
      <div className={subtitleSpaceStyle}>
        <h2>金額</h2>
      </div>
      <p className={priceStyle}>{Math.ceil(newprice)}円</p>

      <div className="border-b-1 border-gray-500 py-4" />
      <div className={subtitleSpaceStyle}>
        <h2>栄養</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-12 mr-auto ">
        {Object.values(intakeNuList).map((nut, index) => (
          <div key={index} className="flex border-b border-gray-100 pb-1">
            <p className="w-24 text-gray-400 text-sm font-bold bg-gray-100">
              {nut.name}
            </p>

            <p
              className={(() => {
                const max = nut.max;
                const min = nut.min;
                const intake = nut.intake;

                if (intake < min) {
                  return " text-blue-400 px-2 w-20 bg-gray-50 text-right";
                } else if (intake > max) {
                  return "text-red-400 px-2 w-20 bg-gray-50 text-right";
                } else {
                  return "text-gray-400 px-2 w-20 bg-gray-50 text-right";
                }
              })()}
            >
              {Math.floor(nut.intake)}
            </p>
            <p className="w-40 text-gray-400 bg-gray-50 text-right">
              {nut.min} ~ {nut.max}
              {nut.unit}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          exportCSV(inputIngInfo);
        }}
      >
        csvで保存
      </button>
      <button
        onClick={() => {
          //ここで読み込んで{食材id,摂取gram}形式に変換する。
          for (let i = 0; i < inputIngInfo.length; i++) {
            calcAndSetData(inputIngInfo[i]);
          }
        }}
      >
        csvを読み込む
      </button>
    </div>
  );
}
