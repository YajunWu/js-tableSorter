js-tableSorter 2013-7-25版
===========================

概述：
该程序为javascript表格排序插件，供网站开发人员使用。该插件实现了客户端表格的排序，相对于传统的服务器端排序，排序时，它不再与服务器交互，缩短了响应时间。


功能：
   1. 多种数据类型的排序，包括：字符串，整形，浮点型，日期类型。
   2. 图片、链接等html元素的排序。

特点：
   1. 使用方便。只需在html中指定要排序的表格及要排序的列的数据类型即可。
   2. 算法简单，性能好。

使用方法：
   1. 引入js和css文件后，需要为要排序的表格添加属性class=tableGenSorter,并指定表格默认（首次）应按哪列排序：sortBy=0（按第一列排序）。注意：js文件要在所有要排序的表格元素定义结束后引入。
   2. 要排序的表格的列标题标签用<th>，允许排序的列，应在<th>中添加属性type,值可以为string,int,date,float,表示按哪种数据类型排序。
   3. 如果要排序的列是图片、链接等html元素，要在该列的所有单元格<td>中添加value属性。value属性值的数据类型为该列<th>中type的值。


例子：

	<table id="table1" class="tableGenSorter" sortBy="2">
		<thead>
			<tr>
				<th type="string">姓名</th>
				<th type="int">年龄</th>
				<th type="date">入学年月</th>
				<th type="float">分数</th>
				<th type="string">头像</th>
				<th>备注</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>张三</td>
				<td>12</td>
				<td>2009,9,04</td>
				<td>88.1</td>
				<td value="blue" style="background-color:#0000FF;"></td>
				<td>ade</td>
			</tr>
			<tr>
				<td>李四</td>
				<td>13</td>
				<td>2008,9,01</td>
				<td>87.1</td>
				<td value="red" style=" background-color:#FF0000;"></td>
				<td>kwn</td>
			</tr>
			<tr>
				<td>王五</td>
				<td>15</td>
				<td>2008,9,09</td>
				<td>88.8</td>
				<td value="green" style="background-color:#00FF00;"></td>
				<td>lij</td>
			</tr>
			<tr>
				<td>潘六</td>
				<td>14</td>
				<td>2007,9,01</td>
				<td>88.4</td>
				<td value="black" style="background-color:#000000;"></td>
				<td>li3</td>
			</tr>
		</tbody>
	</table>


