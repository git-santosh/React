    /** @jsx React.ReactDOM*/
    const {
        createElement,
        createClass,
        DOM
    } = React;
    const {
        render
    } = ReactDOM;

    let headers = [
        "Book", "Author", "Language", "Published", "Sales"
    ];
    let data = [
        ["The Lord of the Rings", "J. R. R. Tolkien", "English", "1954–1955", "150 million"],
        ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry", "French", "1943", "140 million"],
        ["Harry Potter and the Philosopher's Stone", "J. K. Rowling", "English", "1997", "107 million"],
        ["And Then There Were None", "Agatha Christie", "English", "1939", "100 million"],
        ["Dream of the Red Chamber", "Cao Xueqin", "Chinese", "1754–1791", "100 million"],
        ["The Hobbit", "J. R. R. Tolkien", "English", "1937", "100 million"],
        ["She: A History of Adventure", "H. Rider Haggard", "English", "1887", "100 million"],
    ];

    let exel = createClass({
        displayName: 'Excel',
        _preSearchData: null,
        propTypes: {
            headers: React.PropTypes.arrayOf(React.PropTypes.string),
            initialData: React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.string
                )
            ),
        },
        getInitialState: function () {
            return {
                data: this.props.initialData,
                sortby: null,
                desending: false,
                edit: null,
                search: false
            };
        },
        _sort: function (e) {
            var column = e.target.cellIndex;
            var data = this.state.data.slice(); // or `Array.from(this.state.data)` in ES6
            var descending = this.state.sortby === column && !this.state.descending;
            data.sort(function (a, b) {
                return descending ? (a[column] < b[column] ? 1 : -1) : (a[column] > b[column] ? 1 : -1);
            });
            this.setState({
                data: data,
                sortby: column,
                descending: descending
            });
        },
        _showEditor: function (e) {
            this.setState({
                edit: {
                    row: parseInt(e.target.dataset.row, 10),
                    cell: e.target.cellIndex
                }
            });
        },
        _save: function (e) {
            e.preventDefault();
            // ... do the save
            var input = e.target.firstChild;
            var data = this.state.data.slice();
            data[this.state.edit.row][this.state.edit.cell] = input.value;
            this.setState({
                edit: null, // done editing
                data: data,
            });
        },
        _renderTable: function () {
            return DOM.table({
                    className: 'table table-hover'
                },
                DOM.thead({
                        onClick: this._sort
                    },
                    DOM.tr(null, this.props.headers.map(function (title, index) {
                        if (this.state.sortby === index) {
                            title += this.state.descending ? '\u2191' : '\u2193'
                        }
                        return DOM.th({
                            key: index
                        }, title)
                    }, this))),
                DOM.tbody({
                        onDoubleClick: this._showEditor
                    },
                    this._renderSearch(),
                    this.state.data.map(function (row, rowidx) {
                        return DOM.tr({
                                key: rowidx
                            },
                            row.map(function (cell, idx) {
                                var edit = this.state.edit;
                                var content = cell;
                                if (edit && edit.row === rowidx && edit.cell === idx) {
                                    content = React.DOM.form({
                                            onSubmit: this._save
                                        },
                                        React.DOM.input({
                                            type: 'text',
                                            defaultValue: content,
                                            className: 'form-control input-sm'
                                        })
                                    );
                                }
                                return DOM.td({
                                    key: idx,
                                    'data-row': rowidx
                                }, content);
                            }, this))
                    }, this))
            )
        },
        _renderToolbar: function () {
            return React.DOM.div({
                    className: 'toolbar'
                },
                React.DOM.button({
                    onClick: this._toggleSearch,
                    className: 'btn btn-primary toolbar  setting',
                }, 'Search'),
                React.DOM.a({
                    onClick: this._download.bind(this, 'json'),
                    href: 'data.json',
                    className: 'btn btn-primary toolbar  setting'
                }, 'Export JSON'),
                React.DOM.a({
                    onClick: this._download.bind(this, 'csv'),
                    href: 'data.csv',
                    className: 'btn btn-primary toolbar  setting'
                }, 'Export CSV')
            )

        },
        _download: function (format, ev) {
            var contents = format === 'json' ?
                JSON.stringify(this.state.data) :
                this.state.data.reduce(function (result, row) {
                    return result +
                        row.reduce(function (rowresult, cell, idx) {
                            return rowresult +
                                '"' +
                                cell.replace(/"/g, '""') +
                                '"' +
                                (idx < row.length - 1 ? ',' : '');
                        }, '') +
                        "\n";
                }, '');
            var URL = window.URL || window.webkitURL;
            var blob = new Blob([contents], {
                type: 'text/' + format
            });
            ev.target.href = URL.createObjectURL(blob);
            ev.target.download = 'data.' + format;
        },
        _renderSearch: function () {
            if (!this.state.search) {
                return null
            }
            return (
                React.DOM.tr({
                        onChange: this._search
                    },
                    this.props.headers.map(function (_ignore, idx) {
                        return React.DOM.td({
                                key: idx
                            },
                            React.DOM.input({
                                type: 'text',
                                'data-idx': idx,
                                className: 'form-control input-sm'
                            }))
                    }))
            )
        },
        _toggleSearch: function () {
            if (this.state.search) {
                this.setState({
                    data: this._preSearchData,
                    search: false,
                });
                this._preSearchData = null;
            } else {
                this._preSearchData = this.state.data;
                this.setState({
                    search: true,
                });
            }
        },
        _search: function (e) {
                var needle = e.target.value.toLowerCase();
                if (!needle) { // the search string is deleted
                    this.setState({
                        data: this._preSearchData
                    });
                    return;
                }
                var idx = e.target.dataset.idx; // which column to search
                var searchdata = this._preSearchData.filter(function (row) {
                    return row[idx].toString().toLowerCase().indexOf(needle) > -1;
                });
                this.setState({data: searchdata});
        },
        render: function () {
            return (
                React.DOM.div(null,
                    this._renderToolbar(),
                    this._renderTable()
                )
            );
        },
    })
    let ele1 = createElement(exel, {
        headers: headers,
        initialData: data
    })
    render(ele1, document.querySelector('#main'))