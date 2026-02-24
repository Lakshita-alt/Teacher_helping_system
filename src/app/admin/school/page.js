"use client"

// class is a keyword

import SingleClassOverview from "@/component/admin/SingleClassOverview";

export default function HOME(){

    const ClassInfoApiRes = [
  {
    className: "Class A",
    one: 75,
    two: 82,
    three: 68,
    four: 90,
    graph: "inc"
  },
  {
    className: "Class B",
    one: 88,
    two: 79,
    three: 84,
    four: 80,
    graph: "dec"
  },
  {
    className: "Class C",
    one: 60,
    two: 65,
    three: 63,
    four: 64,
    graph: "mid"
  },
  {
    className: "Class D",
    one: 92,
    two: 94,
    three: 96,
    four: 98,
    graph: "inc"
  },
  {
    className: "Class E",
    one: 70,
    two: 72,
    three: 71,
    four: 69,
    graph: "mid"
  }
];

    return(
        <div>
            <div className="">School Summary</div>
            <div>
              Pie Chart
            </div>
            <div className="flex gap-10">
                <div>Card 1</div>
                <div>Card 2</div>
                <div>Card 3</div>
                <div>Card 4</div>
                <div>Card 5</div>
            </div>
            <div>
                {ClassInfoApiRes.map((cls)=>(
                    <SingleClassOverview key={cls.className} ClsInfo={cls}/>
                ))}
            </div>
        </div>
    )
}