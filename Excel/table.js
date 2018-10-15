 /** @jsx React.ReactDOM*/
 const {createElement , createClass , DOM} = React;
 const {render} = ReactDOM;
 var cols = [
     'Payment',
    'Processing Date',
    'Amount',
    'Payee'
];
  
  var rows = [{
    payment: 'Payment #1',
    date: 'March 20, 1989',
    amount: '$29.99',
    payee: 'John Smith'
  },{
    payment: 'Payment #2',
    date: 'March 22, 1989',
    amount: '$40.00',
    payee: 'Brandon Drew'
  },{
    payment: 'Payment #3',
    date: 'April 2, 1989',
    amount: '$9.50',
    payee: 'Jackie Chan'
  }]
 let comp = React.createClass({
    getInitialState:function(){
        return {data:this.props.initialData };
    },
     render:function(){
         return DOM.table({className:'table table-hover'},
                    DOM.thead({},
                        DOM.tr(null,
                            this.props.headers.map(function(title ,index){
                                return DOM.th({key:index},title)
                            })
                        )
                    ),
                    DOM.tbody({},
                        this.state.data.map(function(row ,idx){
                            return DOM.tr({key:idx},
                                this.cols.map(function(cell,idx){
                                     return DOM.td({key:idx},row[idx])
                                })
                            )
                        }))
                )
     }
 })

 let bind = createElement(comp,{headers:cols ,initialData:rows});
 render(bind,document.querySelector('#main'))