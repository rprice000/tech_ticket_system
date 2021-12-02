
const hexafy = (inputVal =280) => {
    let remain = inputVal%255;
    const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    return chars[Math.floor(remain/16)] + chars[remain - Math.floor(remain/16)*16];
}

const svgStart = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -50 100 100'>`;
let lineW1 = 2;

const deathstar1 = `<circle cx='0' cy='0' r='40' fill='#${hexafy(135)}${hexafy(140)}${hexafy(155)}' stroke='none' />`;
const deathstar2 = `<circle cx='23' cy='-14' r='10' fill='#${hexafy(175)}${hexafy(180)}${hexafy(195)}' stroke='#${hexafy(175)}${hexafy(180)}${hexafy(195)}' stroke-width='${lineW1}' />`;
const deathstar3 = `<circle cx='23' cy='-14' r='10' fill='none' stroke='#${hexafy(135)}${hexafy(140)}${hexafy(155)}' stroke-width='${lineW1}' opacity='0.7' />`;

const coordinates1 = [[23,-24], [23,-14]];
const coordinates2 = [[23 - 10*Math.cos(Math.PI/6),-9],[23,-14]];
const coordinates3 = [[23 + 10*Math.cos(Math.PI/6),-9],[23,-14]];

const redLine = (coordinates) => {
    return `<line x1='${coordinates[0][0]}' y1='${coordinates[0][1]}' x2='${coordinates[1][0]}' y2='${coordinates[1][1]}' stroke='red' stroke-width='${0.75*lineW1}' />`;
};

const redLine1 = redLine(coordinates1);
const redLine2 = redLine(coordinates2);
const redLine3 = redLine(coordinates3);

const redCircle = (radius,opacity) => {
    return `<circle cx='23' cy='-14' r='${radius}' fill='red' stroke='none' opacity='${opacity}' />`;
};

const title1 = `<text x='-45' y='15' fill='#995CA3' font-size='17'>Tech Ticket</text>`;
const title2 = `<text x='-28' y='34' fill='#995CA3' font-size='17'>System</text>`;
const shadow1 = `<text x='-44' y='15' fill='black' font-size='17'>Tech Ticket</text>`;
const shadow2 = `<text x='-27' y='34' fill='black' font-size='17'>System</text>`;

const rayBlast = `<line x1='23' y1='-14' x2='50' y2='-35' stroke='red' stroke-width='${1.2*lineW1}' />`;

const view1 = svgStart + deathstar1 + deathstar2 + deathstar3 + shadow1 + shadow2 + title1 + title2 + "</svg>";
const view2 = svgStart + deathstar1 + deathstar2 + redLine1 + redLine2 + redLine3 + deathstar3 + shadow1 + shadow2 + title1 + title2 + "</svg>";
const view3 = svgStart + deathstar1 + deathstar2 + redLine1 + redLine2 + redLine3 + deathstar3 + redCircle(3,0.25) + shadow1 + shadow2 + title1 + title2 + "</svg>";
const view4 = svgStart + deathstar1 + deathstar2 + redLine1 + redLine2 + redLine3 + deathstar3 + redCircle(5,0.60) + shadow1 + shadow2 + title1 + title2 + "</svg>";
const view5 = svgStart + deathstar1 + deathstar2 + redLine1 + redLine2 + redLine3 + deathstar3 + redCircle(7,0.95) + shadow1 + shadow2 + title1 + title2 + "</svg>";
const view6 = svgStart + deathstar1 + deathstar2 + redLine1 + redLine2 + redLine3 + deathstar3 + rayBlast + "</svg>";

const deathStarView = (view,duration) => {
    return {
        view,
        duration
    };
};

const dsView1 = deathStarView(view1,30);
const dsView2 = deathStarView(view2,15);
const dsView3 = deathStarView(view3,4);
const dsView4 = deathStarView(view4,4);
const dsView5 = deathStarView(view5,4);
const dsView6 = deathStarView(view6,8);

document.querySelector("#deathstar").innerHTML = dsView1.view;

const allViews = [dsView1,dsView2,dsView3,dsView4,dsView5,dsView6];
let viewIndex = 0;
let viewCount = 0;

let viewController = setInterval(() => {
    viewCount++;
    if(viewCount > allViews[viewIndex].duration) {
        viewIndex++;
        viewCount = 0;
        if(viewIndex >= allViews.length) {
            viewIndex = 0;
        }
    }
    document.querySelector("#deathstar").innerHTML = allViews[viewIndex].view;
}, 200);