var EmployeesViewModel = null;
	
function ResetEmployeesView() {
    EmployeesViewModel = new EmployeesViewModelDefinition({
        SortingColumnUpdatedDelegate: GetEmployeesPagedOrdered,
        SortingDirectionUpdatedDelegate: GetEmployeesPagedOrdered,
        ActualCurrentPageNumberUpdatedDelegate: GetEmployeesPagedOrdered,
        PageSizeUpdatedDelegate: GetEmployeesPagedOrdered,
        WithPaging: true,
        PagerDomElementId: 'EmployeesPager'
    });
}

function GetEmployeesPagedOrdered(currentSettings, callback) {
	EmployeesViewModel.SearchText("");

    var pageNumber = currentSettings.ActualCurrentPageNumber;
	var pageSize = currentSettings.PageSize;
	var orderByPropertyName = currentSettings.SortingColumn;
	var sortingDirection = currentSettings.SortingDirection;
	
	var token = GetEmployeesPagedOrderedByAjax(pageSize, pageNumber, orderByPropertyName, sortingDirection);
	
	if(null != token) {
		var employees = token.Employees;
		var actualNumberOfPages = token.ActualNumberOfPages;
		var actualTotalNumberOfRows = token.ActualTotalNumberOfRows;
		var actualCurrentPageNumber = token.ActualCurrentPageNumber;
		var actualCurrentPageRowsCount = token.ActualCurrentPageRowsCount;

		var newSettings = {
			ActualNumberOfPages: actualNumberOfPages,
			ActualTotalNumberOfRows: actualTotalNumberOfRows,
			ActualCurrentPageNumber: actualCurrentPageNumber,
			ActualCurrentPageRowsCount: actualCurrentPageRowsCount
		};

		$("#EmployeesMainDiv").load('KOTemplates/Employees_Template.html',
			function () {
				ko.cleanNode($("#EmployeesMainDiv")[0]);
				if (!isBound('EmployeesMainDiv')) {
					ko.applyBindings(EmployeesViewModel, $("#EmployeesMainDiv")[0]);
				}

				EmployeesViewModel.DataBindFromSettings(employees, newSettings);
				
				if (typeof (callback) != 'undefined' && null != callback) {
					callback();
				}
			}
		);
	}
};

//This is the method resonsible for retrieving employees from the back-end by sorting and paging.
//The implementation of this method differs from one system to another depending on the back-end and the server-side framework and language.
//The most important point to notice here is the "Paging Calculations" section in the method below.
//This section should be taken into consideration and implemented. 
function GetEmployeesPagedOrderedByAjax(pageSize, pageNumber, orderByPropertyName, sortingDirection) {
	var resultToken = null;
	
	var AllEmployees = new Array();
	AllEmployees.push({Id:1, Name:"Employee 1"});
	AllEmployees.push({Id:2, Name:"Employee 2"});
	AllEmployees.push({Id:3, Name:"Employee 3"});
	AllEmployees.push({Id:4, Name:"Employee 4"});
	AllEmployees.push({Id:5, Name:"Employee 5"});
	AllEmployees.push({Id:6, Name:"Employee 6"});
	AllEmployees.push({Id:7, Name:"Employee 7"});
	AllEmployees.push({Id:8, Name:"Employee 8"});
	AllEmployees.push({Id:9, Name:"Employee 9"});
	AllEmployees.push({Id:10, Name:"Employee 10"});
	AllEmployees.push({Id:11, Name:"Employee 11"});
	AllEmployees.push({Id:12, Name:"Employee 12"});
	AllEmployees.push({Id:13, Name:"Employee 13"});
	AllEmployees.push({Id:14, Name:"Employee 14"});
	AllEmployees.push({Id:15, Name:"Employee 15"});
	AllEmployees.push({Id:16, Name:"Employee 16"});
	AllEmployees.push({Id:17, Name:"Employee 17"});
	AllEmployees.push({Id:18, Name:"Employee 18"});
	
	if(AllEmployees.length > 0) {
		AllEmployees.sort(function (a, b) {
			var result = 0;
			var valA = a[orderByPropertyName];
			var valB = b[orderByPropertyName];
			
			if (isNumeric(valA) && isNumeric(valB)) {
				valA = valA.toString().toLowerCase().replace(',', '');
				valB = valB.toString().toLowerCase().replace(',', '');

				if (parseFloat(valA) == parseFloat(valB)) {
					result = 0;
				}
				else if (parseFloat(valA) > parseFloat(valB)) {
					result = 1;
				}
				else {
					result = -1;
				}
			}
			else {
				if (valA == valB) {
					result = 0;
				}
				else if (valA > valB) {
					result = 1;
				}
				else {
					result = -1;
				}
			}

			if (sortingDirection.toLowerCase().indexOf('asc') == -1) {
				result = result * -1;
			}

			return result;
		});
		
		//-------------------------------------------------Paging Calculations-------------------------------------------------
		if(pageSize <= 0) {
			pageSize = AllEmployees.length;
		}
		
		var maxNumberOfPages = Math.max(1, Math.ceil(parseFloat(parseFloat(AllEmployees.length) / parseFloat(pageSize))));
		
		if(pageNumber < 1) {
			pageNumber = 1;
		}
		else if(pageNumber > maxNumberOfPages) {
			pageNumber = maxNumberOfPages;
		}
		
		var pageIndex = pageNumber - 1;
		var firstItemIndex = pageIndex * pageSize;
		var lastItemIndex = (pageIndex * pageSize) + (pageSize - 1);
		var actualNumberOfPages = maxNumberOfPages;
		var actualTotalNumberOfRows = AllEmployees.length;
		var actualCurrentPageNumber = pageNumber;
		
		if(lastItemIndex > AllEmployees.length) {
			lastItemIndex = AllEmployees.length - 1;
		}
		
		var actualCurrentPageRowsCount = lastItemIndex - firstItemIndex;
		//-------------------------------------------------Paging Calculations-------------------------------------------------
		
		resultToken = new Object();
		resultToken.Employees = AllEmployees.slice(firstItemIndex, lastItemIndex + 1);
		resultToken.ActualNumberOfPages = actualNumberOfPages;
		resultToken.ActualTotalNumberOfRows = actualTotalNumberOfRows;
		resultToken.ActualCurrentPageNumber = actualCurrentPageNumber;
		resultToken.ActualCurrentPageRowsCount = actualCurrentPageRowsCount;
	}
	
	return resultToken;
}

function BindGrid(callback) {
    GetEmployeesPagedOrdered(EmployeesViewModel.GetFinalSettings(), callback);
};

$(document).ready(function(){
	ResetEmployeesView();
	BindGrid();
});