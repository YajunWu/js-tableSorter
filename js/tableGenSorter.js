/***********************************
 * 最基本最原始版的表格排序工具
 */

(function() {
  /************************************
   * 转换函数，将字符串转换成要转换成的类型
   * DOM的文本节点知识字符串值，所以排序前要对数据进行转换
   * @param {string} sValue
   * @param {string} sDataType
   */
  function convert(sValue, sDataType) {
    switch(sDataType) {
      case "int":
        return parseInt(sValue);
      case "float":
        return parseFloat(sValue);
      case "date":
        return new Date(Date.parse(sValue));
      default:
        return sValue.toString();
    }
  }

  /*********************************************
   * 比较函数生成器，对<tr/>元素进行排序，直接返回一个比较函数
   * 使用闭包的形式，使比较函数能够捕获到要进行比较的列的索引及数据类型
   * @param {int} iCol
   * @param {string} sDataType
   */
  function generateCompareTRs(iCol, sDataType) {
    return function compareTRs(oTR1, oTR2) {
      var vValue1, vValue2;
      
      //判断是从<td/>元素的文本中读取可排序的值还是从value特性中读取
      //对那些包含了HTML代码的单元格添加了value特性，这样可以识别出表格中比较复杂的内容，如链接、图像或某种HTML内容。
      if (oTR1.cells[iCol].getAttribute("value")) {
        vValue1 = convert(oTR1.cells[iCol].getAttribute("value"), sDataType);
        vValue2 = convert(oTR2.cells[iCol].getAttribute("value"), sDataType);
      } else {
        vValue1 = convert(oTR1.cells[iCol].firstChild.nodeValue, sDataType);
        vValue2 = convert(oTR2.cells[iCol].firstChild.nodeValue, sDataType);
      }
      
      switch(sDataType) {
        case "int":
        case "float":
        case "date":
          if(vValue1 < vValue2) {
            return -1;
          } else if(vValue1 > vValue2) {
            return 1;
          } else {
            return 0;
          }
        default:
          return vValue1.localeCompare(vValue2);
      }
    };
  }
  
  /**************************************
   * 寻找表格总第一个可以排序的列索引
   * @param {Object} oTable
   */
  function getFirstSortColIndex(oTable) {
	  for(var i = 0; i < oTable.tHead.rows[0].children.length; i++) {
      if(!!oTable.tHead.rows[0].children[i].getAttribute("type")) {
	  	  return i;
	    } else {
		    continue;
	    }
    }
	  return -1;
  }
  
  /*********************
   *主排序函数
   */
  function sortTable() {
    var sortedTables = document.getElementsByClassName("tableGenSorter");
    var tables = new Array;
  
    for(var i = 0; i < sortedTables.length; i++) {
      var sortBy;//列索引
      var oCurTh;
      tables[i] = sortedTables[i];
      
      if (tables[i].getAttribute("sortBy")) {
        sortBy = parseInt(tables[i].getAttribute("sortBy"));
        
        //判断当前列是否允许排列,如果不允许排序则寻找第一个可以排序的列索引
        oCurTh = tables[i].tHead.rows[0].children[sortBy];
        if (!tables[i].tHead.rows[0].children[sortBy].getAttribute("type")) {
          sortBy = getFirstSortColIndex(tables[i]);
        }
      }
      else {
        sortBy = getFirstSortColIndex(tables[i]);
      }
      
      if (sortBy == -1) {
        continue;
      }
      else {
        //排序
        
        var tbody = sortedTables[i].tBodies[0];
        var rows = tbody.rows;//colDataRows为DOM集合，并非数组，它并没有sort()方法
        var trs = new Array;
        oCurTh = sortedTables[i].tHead.rows[0].children[sortBy];
        
        for(var j = 0; j < rows.length; j++) {
          trs[j] = rows[j];
        }
        
        trs.sort(generateCompareTRs(sortBy, oCurTh.getAttribute("type")));//按升序排
         
        //添加箭头
        var arrow = document.createElement("img");
        arrow.src = "./css/asc.gif";
        oCurTh.appendChild(arrow);
          
        //创建文档对象，并将所有的<tr/>元素添加进去，并将它们从原来的表格中删除。
        var oFragment = document.createDocumentFragment();
        for(var j = 0; j < trs.length; j++) {
          oFragment.appendChild(trs[j]);
        }
          
        //碎片的子节点被放回到<tbody/>元素中。当使用appendChild()并传给它一个文档碎片，最后添加的是碎片的所有子节点，而非碎片本身。
        tbody.appendChild(oFragment);
        
        //将列索引保存起来，以便后续比较。
        tables[i].sortCol = sortBy;
        tables[i].asc = true;
        
        tables[i].onclick = function(oEvent) {
          //表格排序，获取表格的DOM引用来定位数据行，再使用compareTRs()函数对数组进行排序，
          //然后创建文档碎片，并将所有的<tr/>元素按照正确的顺序附加其上，最后将所有的子节点添加到<tbody/>元素中。
          var oTable = oEvent.currentTarget;
          var oTh = oEvent.target;
          var sDataType;
          var asc;
          var iCol;
          if ((oTh.localName == "th") && (oTable.localName == "table") && !!oTh.getAttribute("type"))
              iCol = oTh.cellIndex;
          else 
            return;
        
          var oTBody = oTable.tBodies[0];
          var colDataRows = oTBody.rows;//colDataRows为DOM集合，并非数组，它并没有sort()方法
          var aTRs = new Array;
          
          for(var i = 0; i < colDataRows.length; i++) {
            aTRs[i] = colDataRows[i];
          }
          
          //判断检测列索引是否与最后一次排序的列索引相同。如果相同，则应该对数组进行反转，否则进行排序。
          if (oTable.sortCol == iCol) {
            aTRs.reverse();//反转列的顺序
            asc = !oTable.asc;
            oTh.removeChild(oTh.lastChild);
          } else {
            sDataType = oTh.getAttribute("type");
            aTRs.sort(generateCompareTRs(iCol, sDataType));
            asc = true;
            if (oTable.sortCol != null) {
              var lastTh = oTable.tHead.rows[0].children[oTable.sortCol];
              var img = lastTh.lastChild;
              lastTh.removeChild(img);
            }
          }
          
          //添加上下箭头
          var arrow = document.createElement("img");
          if(asc) {
            arrow.src = "./css/asc.gif";  
          } else {
            arrow.src = "./css/desc.gif";
          }
          oTh.appendChild(arrow);
          
          //创建文档对象，并将所有的<tr/>元素添加进去，并将它们从原来的表格中删除。
          var oFragment = document.createDocumentFragment();
          for(var i = 0; i < aTRs.length; i++) {
            oFragment.appendChild(aTRs[i]);
          }
          
          //碎片的子节点被放回到<tbody/>元素中。当使用appendChild()并传给它一个文档碎片，最后添加的是碎片的所有子节点，而非碎片本身。
          oTBody.appendChild(oFragment);
          
          //将列索引保存起来，以便后续比较。
          oTable.sortCol = iCol;
          oTable.asc = asc;
        }
      }
    } 
  }
  
  sortTable();
  
})();
