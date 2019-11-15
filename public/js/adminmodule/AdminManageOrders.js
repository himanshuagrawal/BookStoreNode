window.addEventListener('load',()=>{
    const orderList=[];

    //getting All users
    getData();
    function getData(){
        fetch('/userapi/getallusers').then((res)=>{
            return res.json();
        }).then((data)=>{
            console.log(data);
            makeOrderList(data);
        })
    }

    //getting all the orders
    function makeOrderList(users){
        Array.from(users).forEach((user)=>{
            Array.from(user.order).forEach((order)=>{
                let count =0;
                let transactionDate;
                Array.from(user.ordered).forEach((orderr)=>{
                    if(orderr.orderId===order.orderId){
                        count=count+orderr.numberOfBooks;
                        transactionDate = new Date(orderr.transactionDate).toDateString();
                    }
                })
                orderList.push({
                    userId:user._id,
                    userName:user.fullName,
                    orderId:order._id,
                    orderNumber:order.orderId,
                    orderStatus:order.status,
                    totalCount:count,
                    transactionDate:transactionDate
                })
            })
        })
        console.log(orderList)
        makeOrder();
    }

    function makeOrder(){
        orderList.reverse().forEach((order)=>{
            makeElement(order);
        })
    }

    function makeElement(order){
        let row = document.createElement('div');
        $(row).addClass('row order-items-container-row');

        let orderNumberContainer = document.createElement('div');
        $(orderNumberContainer).addClass('col-lg-2');
        let orderNumber = document.createElement('p');
        orderNumber.textContent=order.orderNumber;
        orderNumberContainer.append(orderNumber);

        let customerNamerContainer = document.createElement('div');
        $(customerNamerContainer).addClass('col-lg-2');
        let customerName = document.createElement('p');
        customerName.textContent=order.userName;
        customerNamerContainer.append(customerName);

        let totalBookCountContainer = document.createElement('div');
        $(totalBookCountContainer).addClass('col-lg-1');
        let totalBookCount = document.createElement('p');
        totalBookCount.textContent=order.totalCount;
        totalBookCountContainer.append(totalBookCount);

        let dateContainer = document.createElement('div');
        $(dateContainer).addClass('col-lg-2');
        let date = document.createElement('p');
        date.textContent=order.transactionDate;
        dateContainer.append(date);

        let dispatchContainer = document.createElement('div');
        $(dispatchContainer).addClass('col-lg-2');
        let dispatch = document.createElement('input');
        $(dispatch).attr('type','checkbox').attr('id','dispatchCheckbox');
        dispatchContainer.append(dispatch);

        let shippedContainer = document.createElement('div');
        $(shippedContainer).addClass('col-lg-1');
        let shipped = document.createElement('input');
        $(shipped).attr('type','checkbox').attr('id','shippedCheckox');
        shippedContainer.append(shipped);

        let dispatchSlipContainer = document.createElement('div');
        $(dispatchSlipContainer).addClass('col-lg-2');
        let dispatchSlip = document.createElement('button');
        $(dispatchSlip).attr('id','dispatchSlipButton').addClass('btn btn-primary dispatch-slip').text('Dispatch Slip');
        dispatchSlipContainer.append(dispatchSlip);


        $(row).append(orderNumberContainer).append(customerNamerContainer).append(totalBookCountContainer)
        .append(dateContainer).append(dispatchContainer).append(shippedContainer).append(dispatchSlipContainer);
        document.querySelector('.order-items-container').append(row);
    }

})