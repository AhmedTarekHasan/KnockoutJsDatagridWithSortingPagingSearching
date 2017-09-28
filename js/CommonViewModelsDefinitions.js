var AppSettings = new Object();
AppSettings.PageSize = 5;
AppSettings.ShortenAt = 15;
AppSettings.ShortenMoreText = "more";
AppSettings.ShortenLessText = "less";


function EmployeesViewModelDefinition(settings) {
    var self = this;

    self.IsNullOrUndefinedOrEmpty = function (obj) {
        return (typeof (obj) == 'undefined' || undefined == obj || null == obj || '' == obj.toString().trim());
    };

    self.finalSettings = {
        WithPaging: (self.IsNullOrUndefinedOrEmpty(settings.WithPaging)) ? false : settings.WithPaging,
        PageSize: (self.IsNullOrUndefinedOrEmpty(settings.PageSize)) ? AppSettings.PageSize : settings.PageSize,
        ActualCurrentPageNumber: (self.IsNullOrUndefinedOrEmpty(settings.ActualCurrentPageNumber)) ? 1 : settings.ActualCurrentPageNumber,
        ActualNumberOfPages: (self.IsNullOrUndefinedOrEmpty(settings.ActualNumberOfPages)) ? 1 : settings.ActualNumberOfPages,
        ActualTotalNumberOfRows: (self.IsNullOrUndefinedOrEmpty(settings.ActualTotalNumberOfRows)) ? 0 : settings.ActualTotalNumberOfRows,
        ActualCurrentPageRowsCount: (self.IsNullOrUndefinedOrEmpty(settings.ActualCurrentPageRowsCount)) ? 0 : settings.ActualCurrentPageRowsCount,
        PagerDomElementId: (self.IsNullOrUndefinedOrEmpty(settings.PagerDomElementId)) ? null : settings.PagerDomElementId,
        SortingColumn: (self.IsNullOrUndefinedOrEmpty(settings.SortingColumn)) ? 'Id' : settings.SortingColumn,
        SortingDirection: (self.IsNullOrUndefinedOrEmpty(settings.SortingDirection)) ? 'asc' : settings.SortingDirection,
        WithPagingUpdatedDelegate: (self.IsNullOrUndefinedOrEmpty(settings.WithPagingUpdatedDelegate)) ? function (currentSettings) { } : settings.WithPagingUpdatedDelegate,
        PageSizeUpdatedDelegate: (self.IsNullOrUndefinedOrEmpty(settings.PageSizeUpdatedDelegate)) ? function (currentSettings) { } : settings.PageSizeUpdatedDelegate,
        ActualCurrentPageNumberUpdatedDelegate: (self.IsNullOrUndefinedOrEmpty(settings.ActualCurrentPageNumberUpdatedDelegate)) ? function (currentSettings) { } : settings.ActualCurrentPageNumberUpdatedDelegate,
        SortingColumnUpdatedDelegate: (self.IsNullOrUndefinedOrEmpty(settings.SortingColumnUpdatedDelegate)) ? function (currentSettings) { } : settings.SortingColumnUpdatedDelegate,
        SortingDirectionUpdatedDelegate: (self.IsNullOrUndefinedOrEmpty(settings.SortingDirectionUpdatedDelegate)) ? function (currentSettings) { } : settings.SortingDirectionUpdatedDelegate
    };
	
    self.GetFinalSettings = function () {
        for (var prop in self) {
            if (self.finalSettings.hasOwnProperty(prop)) {
                self.finalSettings[prop] = self[prop]();
            }
        }

        return self.finalSettings;
    };

    self.SynchronizeSettings = function (source, destination) {
        for (var prop in destination) {
            if (destination.hasOwnProperty(prop)) {
                if (typeof (source[prop]) != 'undefined' && null != source[prop]) {
                    destination[prop] = source[prop];
                }
            }
        }
    };
	
	self.SearchText = ko.observable();
	
    self.private_WithPaging = ko.observable(self.finalSettings.WithPaging);
    self.WithPaging = ko.computed({
        read: function () {
            return self.private_WithPaging();
        },
        write: function (value) {
            self.private_WithPaging(value);

            if (typeof (self.finalSettings.WithPagingUpdatedDelegate) != 'undefined' && null != self.finalSettings.WithPagingUpdatedDelegate) {
                self.finalSettings.WithPagingUpdatedDelegate(self.GetFinalSettings());
            }
        },
        deferEvaluation: true
    });

    self.private_PageSize = ko.observable(self.finalSettings.PageSize);
    self.PageSize = ko.computed({
        read: function () {
            return self.private_PageSize();
        },
        write: function (value) {
            if (typeof (value) == 'undefined' || null == value || '' == value) {
                value = AppSettings.PageSize;
            }

            self.private_PageSize(value);

            if (typeof (self.finalSettings.PageSizeUpdatedDelegate) != 'undefined' && null != self.finalSettings.PageSizeUpdatedDelegate) {
                self.finalSettings.PageSizeUpdatedDelegate(self.GetFinalSettings());
            }
        },
        deferEvaluation: true
    });

    self.private_PagerDomElementId = ko.observable(self.finalSettings.PagerDomElementId);
    self.PagerDomElementId = ko.computed({
        read: function () {
            return self.private_PagerDomElementId();
        },
        write: function (value) {
            self.private_PagerDomElementId(value);
        },
        deferEvaluation: true
    });

    self.private_SortingColumn = ko.observable(self.finalSettings.SortingColumn);
    self.SortingColumn = ko.computed({
        read: function () {
            return self.private_SortingColumn();
        },
        write: function (value) {
            if (value == self.private_SortingColumn()) {
                self.private_SortingDirection(self.ToggleSortingDirection(self.SortingDirection()));
            }
            else {
                self.private_SortingColumn(value);
            }

            if (!self.WithPaging()) {
                self.SortEmployees();
            }
            else if (typeof (self.finalSettings.SortingColumnUpdatedDelegate) != 'undefined' && null != self.finalSettings.SortingColumnUpdatedDelegate) {
                self.finalSettings.SortingColumnUpdatedDelegate(self.GetFinalSettings());
            }
        },
        deferEvaluation: true
    });

    self.ToggleSortingDirection = function (currentDirection) {
        var finalDirection;

        if (currentDirection.toLowerCase().indexOf('asc') > -1) {
            finalDirection = 'desc';
        }
        else {
            finalDirection = 'asc';
        }

        return finalDirection;
    };

    self.private_SortingDirection = ko.observable(self.finalSettings.SortingDirection);
    self.SortingDirection = ko.computed({
        read: function () {
            return self.private_SortingDirection();
        },
        write: function (value) {
            self.private_SortingDirection(self.ToggleSortingDirection(self.SortingDirection()));

            if (!self.WithPaging()) {
                self.SortEmployees();
            }
            else if (typeof (self.finalSettings.SortingDirectionUpdatedDelegate) != 'undefined' && null != self.finalSettings.SortingDirectionUpdatedDelegate) {
                self.finalSettings.SortingDirectionUpdatedDelegate(self.GetFinalSettings());
            }
        },
        deferEvaluation: true
    });

    self.SetEmployeesSorting = function (sortingColumn) {
        self.SortingColumn(sortingColumn);
    };

    self.SortEmployees = function () {
        self.Employees.sort(self.SortEmployeesComparer);
    };

    self.SortEmployeesComparer = function (a, b) {
        var result = 0;

        var sortingColumn = self.SortingColumn();
        var sortingDirection = self.SortingDirection();

        var valA = a[sortingColumn]();
        var valB = b[sortingColumn]();

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
    };

    self.DataBind = function (JSEmployees, actualNumberOfPages, actualTotalNumberOfRows, actualCurrentPageNumber, actualCurrentPageRowsCount) {
        var retrievedEmployees = ko.mapping.fromJS(JSEmployees);

        self.Employees.removeAll();

        for (var i = 0; i < retrievedEmployees().length; i++) {
            var Employee = (retrievedEmployees())[i];
            self.Employees.push(Employee);
        }

        self.finalSettings.ActualNumberOfPages = actualNumberOfPages;
        self.finalSettings.ActualTotalNumberOfRows = actualTotalNumberOfRows;
        self.finalSettings.ActualCurrentPageNumber = actualCurrentPageNumber
        self.finalSettings.ActualCurrentPageRowsCount = actualCurrentPageRowsCount;
        self.BuildPager();
    };

    self.DataBindFromSettings = function (JSEmployees, newSettings) {
        var finalSettings = self.GetFinalSettings();
        self.SynchronizeSettings(newSettings, finalSettings);
        self.DataBind(JSEmployees, finalSettings.ActualNumberOfPages, finalSettings.ActualTotalNumberOfRows, finalSettings.ActualCurrentPageNumber, finalSettings.ActualCurrentPageRowsCount);
    };

    self.BuildPager = function () {
        if (!self.IsNullOrUndefinedOrEmpty(self.PagerDomElementId()) && self.WithPaging() && self.Employees().length > 0 && self.finalSettings.ActualNumberOfPages > 1) {
            $("#" + self.PagerDomElementId()).show();

            $("#" + self.PagerDomElementId()).paginate({
                count: self.finalSettings.ActualNumberOfPages,
                start: self.finalSettings.ActualCurrentPageNumber,
                display: 11,
                border: false,
                text_color: 'rgba(255, 255, 255, 1)',
                background_color: 'rgba(255, 255, 255, 0)',
                text_hover_color: '#FB6E52',
                background_hover_color: '#FFFFFF',
                images: false,
                onChange: function (newPageNumber) {
                    if (newPageNumber != self.finalSettings.ActualCurrentPageNumber) {
                        self.finalSettings.ActualCurrentPageNumber = newPageNumber;

                        if (typeof (self.finalSettings.ActualCurrentPageNumberUpdatedDelegate) != 'undefined' && null != self.finalSettings.ActualCurrentPageNumberUpdatedDelegate) {
                            self.finalSettings.ActualCurrentPageNumberUpdatedDelegate(self.GetFinalSettings());
                        }
                    }
                }
            });
        }
        else {
            $("#" + self.PagerDomElementId()).hide();
        }
    };
	
	
	//Define your own entities array here
	self.Employees = ko.observableArray();
	
	//Include your own entities columns here
	self.SearchTextExistsOnRow = function(employee) {
		if(self.IsNullOrUndefinedOrEmpty(self.SearchText())) {
			return true;
		}
		else {
			return (employee.Id().toString().toLowerCase().indexOf(self.SearchText().toLowerCase())) != -1
			|| (employee.Name().toString().toLowerCase().indexOf(self.SearchText().toLowerCase())) != -1;
		}		
	};
}