function getToday(){

  let date = new Date(); 
  let year = date.getFullYear(); 
  let month = new String(date.getMonth()+1); 
  let day = new String(date.getDate()); 

  // 한자리수일 경우 앞에 0을 채워준다. 
  if(month.length == 1){ 
    month = '0' + month; 
  } 
  if(day.length == 1){ 
    day = '0' + day; 
  } 

  return year+month+day;
}

url = "https://open.neis.go.kr/hub/mealServiceDietInfo";

var params = {
  KEY: "16c6ed183ccf402dbff0d174ff8a04d7",
  Type: "JSON",
  Index: "1",
  pSize: "100",
  ATPT_OFCDC_SC_CODE: "B10",
  SD_SCHUL_CODE: "7010126",
  MLSV_YMD: getToday()
}

var xhr = new XMLHttpRequest();
url += "?";
for (var key in params) {
  url += key + "=" + params[key] + "&";
}
url = url.slice(0, -1);

xhr.open("GET", url);
xhr.send();

xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    var data = JSON.parse(xhr.responseText);

    console.log(data);
    
    if (("RESULT" in data)) {
      let menu = document.getElementById("menu");
      let menuList = document.createElement("span");
      menuList.innerHTML = "오늘은 급식이 없습니다.";    
      menu.appendChild(menuList);
    }else {
    var lunch = data.mealServiceDietInfo[1].row[0].DDISH_NM;
    var dinner = data.mealServiceDietInfo[1].row[1].MMEAL_SC_NM;

    console.log(lunch, dinner);
    
    var lunText = lunch.split("<br/>");
    
    class lun  {
      constructor(){
        this.menu = "메뉴";
        this.alergy = "알러지";
      }
    }

    for (i=0; i<lunText.length; i++) {
      var regExp = /\(([^)]+)\)/;
      var matches = regExp.exec(lunText[i]);
      tmpLun = new lun;
      tmpLun.alergy = matches[1];

      regExp = /\([^)]*\)/;
      matches = lunText[i].replace(regExp, "");
      
      tmpLun.menu = matches;

      console.log(tmpLun);

      lunText[i] = tmpLun;
    }

    let menu = document.getElementById("menu");
    for (i =0; i<lunText.length; i++) {
      let menuList = document.createElement("span");
      menuList.innerHTML = lunText[i].menu;    
      menu.appendChild(menuList);
      let alergyList = document.createElement("span");
      alergyList.id = "alergy";
      alergyList.innerHTML = lunText[i].alergy;
      menu.appendChild(alergyList);
      let br = document.createElement("br");
      menu.appendChild(br);
    }
    
  }



  }
}