$(document).ready(function () {

 // SlideBar Navigation
    $(".nav-link").click(function () {
        $(".nav-item").removeClass("active");
        $(this).addClass("active");
        $(".ClsDvContent").hide();
        var name = $(this).data("name");
        $("#" + name).show();
    });

    //PopUp
    $("#AddNewDealerBtn").click(function () {
        $(".clscommon").removeAttr("disabled");
        $("#DivSaveClear").show();
        $("#TxtNewFlower,#DivUpdate").hide();
        $("#NewDealerForm")[0].reset();
        $("#AddNewDealerFormTitle").html("Add New Wholesale Dealer Details");
        $("#AddNewDealerForm").modal("show");
    });

    // Add Flower Button Trigger Event
    $("#AddFlowerBtn").click(function () {
        $("#TxtNewFlower").show();
        $("#AddFlowerBtn").hide();
    });

     // Cancel Add Flower Button Trigger Event
    $("#btnCancelFlower").click(function () {
        $("#TxtNewFlower").hide();
        $("#AddFlowerBtn").show();
    });
    // Agreement Radio Button Trigger Event
    $(".ClsRaBtn").click(function () {
        $(".ClsDate").hide();
        var name = $(this).data("name");
        $("#" + name).show();
    });

    // Clear Add New Dealer Form
    $("#ClearNewDealer").click(function () {
        $("#NewDealerForm")[0].reset();
        $("#DnPartialDate,#TxtNewFlower").hide();
    });

    // Clear Filter Form
    $("#ClearFilter").click(function () {
        $("#FilterForm")[0].reset();
    });

    // Clear Entry Form
    $("#ClearEntry").click(function () {
        $("#EntryForm")[0].reset();
    }); 

 // Logout Conformation Popup
    $("#LogBtn").click(function () {
        $("#logoutModal").modal();
    });

    // Logout- Navigate To Login Page
    $("#LogoutBtn").click(function () {
        window.location.href = LogouyURL;
    });
    
    // Add New Flower Ok Button
    $("#OkBtn").click(function () {
        
        var Values = {
            NewFlower: $("#AddFlowerTxt").val()
        }
        $.ajax({
            type: "POST",
            url: AddFlowerUrl,
            data: JSON.stringify(Values),
            contentType: "application/json; charset-utf-8",
            dataType: "json",
            success: function (data) {
                if (data.Status == "00") {
                //Binding Flower CheckBox Value
                var Flower = $("#AddFlowerTxt").val()
                var stringBuilder = "";
               
                stringBuilder += ' <div class="col-sm-3">'
                stringBuilder += '  <label class="checkbox">'
                stringBuilder += ' <input type="checkbox" value="'+data.FlowerID+'" />' + Flower + ' '
                stringBuilder += ' </label>'
                stringBuilder += '  </div>'
                
                $("#DivFlowerChcBox").append(stringBuilder);
                
                    swal(data.Result);
                }
                else
                    swal("Unable to insert flower. Please try again later.");
            },
            error: function (ex) {
                swal("Unable to connect the server");
            }
        });

        

    });

    // SaveButton Function
    $("#SaveNewDealerBtn").click(function () {
        debugger
        var flower = "";
        var AgreementType = "";
        
        $(".ClsChBox").each(function () {
            if ($(this).prop("checked") == true) {
                flower += $(this).data("name") + "|"
                flowername += $(this).data("flower") + "|"
            }
        })
           
        
        if ($("#PartialDateRaBtn").prop("checked")) 
            AgreementType = "Partial";
        else if ($("#LifeTimeRaBtn").prop("checked")) 
            AgreementType = "Lifetime";
        else 
            AgreementType = "None";
        

        var Values = {
            Name: $("#TxBoxName").val(),
            Address: $("#TxBoxAddress").val(),
            PhoneNo: $("#TxBoxPhone").val(),
            Email: $("#TxBoxEmail").val(),
            FlowerId: flower,
            FlowerName: flowername,
            Agreement: AgreementType,
            FromDate: $("#Fromdate").val(),
            ToDate: $("#Todate").val(),          
        }
        
        $.ajax({
            type: "POST",
            url: AddDealerUrl,
            data: JSON.stringify(Values),
            contentType: "application/json; charset-utf-8",
            dataType: "json",
            success: function (data) {
                swal(data.Result);
                $("#AddNewDealerForm").modal("hide");
                LoadTable();
            },
            error: function (ex) {
                swal("Unable to connect the server");
            }
        });
    });

    //Entry Form Insert
    $("#SaveEntryBtn").click(function () {
        debugger
        var Values = {           
            DealerId: $("#selDea").val(),
            Date: $("#txtdate").val(),
            DealerName: $("#selDea :selected").text(),
            FlowerId: $("#selFlo").val(),
            FlowerName: $("#selFlo :selected").text(),            
            Quantity: $("#txtquantity").val(),
            Price: $("#txtprice").val(),
            Amount: $("#txtamount").val()
        }
        $.ajax({
            type: "POST",
            url: PurchaseUrl,
            data: JSON.stringify(Values),
            contentType: "application/json; charset-utf-8",
            dataType: "json",
            success: function (data) {
                swal(data.Result);
                $("#EntryForm")[0].reset();
            },
            error: function (ex) {
                swal("Unable to connect the server");
            }
        });
    });

    // Entry Form Amount TextBox
    $(".clscalculation").keyup(function () {
        var price = parseInt($("#txtprice").val());
        var quantity = parseInt($("#txtquantity").val());
        $("#txtamount").val(price * quantity);
    });

    //Filter Get Button
    $("#SearchBtn").click(function () {
        debugger
        var Values = {
            Dname: $("#selDeaname").val(),
            Fname: $("#selFloname").val(),
            Date: $("#purdate").val()
        }
        $.ajax({
            type: "POST",
            url: "/Main/FilterData",
            data: JSON.stringify(Values),
            contentType: "application/json; charset-utf-8",
            dataType: "json",
            success: function (data) {
                if (data.Status == "00") {
                    var stringBuilder = "";
                    var data = JSON.parse(data.result);

                    for (var i = 0; i < data.length; i++) {
                        stringBuilder += '<tr>';
                        stringBuilder += '<td>' + data[i].E_DATE + ' </td>'
                        stringBuilder += '<td>' + data[i].E_DEALER_NAME + ' </td>'
                        stringBuilder += '<td>' + data[i].E_FLOWER_NAME + ' </td>'
                        stringBuilder += '<td>' + data[i].E_QUANTITY + ' </td>'
                        stringBuilder += '<td>' + data[i].E_PRICE + ' </td>'
                        stringBuilder += '<td>' + data[i].E_AMOUNT + ' </td>'
                        stringBuilder += '</tr>';
                    }
                    $("#ResultTableBody").html(stringBuilder);
                    $("#ResultTable").show();
                }
                else {
                    swal("No Data Found");
                }
            },
            error: function (ex) {
                swal("Unable to connect the server");
            }
        });
    })
    AssignFlowers();
    LoadTable();



});
// Binding Dealer Table
function LoadTable() {
    var Values = {
        strtemp: ""
    }

    $.ajax({
        url: GetDealerTable,
        type: "POST",
        data: JSON.stringify(Values),
        contentType: "application/json; charset-utf-8",
        dataType: "json",
        success: function (data) {
            
            if (data.status = "00") {
                var stringBuilder = "";
                var data = JSON.parse(data.result);
                var stringBuilder = "";
                var DelaerBuilder = "";
                DelaerBuilder += '<option value="0">--Select--</option>';
                for (var i = 0; i < data.length; i++) {

                    DelaerBuilder += '  <option value=" ' + data[i].D_ID + '">' + data[i].D_NAME + '</option > ';

                    stringBuilder += '<tr data-address="' + data[i].D_ADDRESS + ' " data-email="' + data[i].D_EMAIL_ID + ' " data-flowerid= " ' + data[i].D_FLOWER_ID + ' " data-agreement="' + data[i].D_AGREEMENT + ' "  data-fromdate="' + data[i].D_FROM_DATE + '" data-todate="' + data[i].D_TO_DATE + ' ">'
                    stringBuilder += '<td id="tblID"> ' + data[i].D_ID + ' </td>'
                    stringBuilder += '<td id="tblName">' + data[i].D_NAME + ' </td>'
                    stringBuilder += '<td id="tblPhoneNo">' + data[i].D_PHONE_NO + ' </td>'
                    stringBuilder += '<td class="clstableview" onclick="TableActions()"><a href="#" >View</a> </td>'
                    stringBuilder += '<td class="clstableEdit clstableview"><a href="#" >Edit</a></td>'
                    stringBuilder += '<td class="clstableDelete"><a href="#" >Delete</a> </td>'
                    stringBuilder += '</tr>'
                }
                $(".SelDeName").html(DelaerBuilder);
                $("#SetDealerList").html(stringBuilder);
                TableActions();
            }
            else {
                swal("Unable to get data. Please try again later.");
            }
        }
    });


}
// Add New Dealer - Insert New Flower Function
function AssignFlowers() {
    var Values = {
        strtemp: ""
    }

    $.ajax({
        url: GetDealerTable,
        type: "POST",
        data: JSON.stringify(Values),
        contentType: "application/json; charset-utf-8",
        dataType: "json",
        success: function (data) {

            if (data.status = "00") {
                var stringBuilder = "";
                var FlowerBuilder = "";
                var data = JSON.parse(data.result);
                FlowerBuilder += '<option value="0">--Select--</option>';
                for (var i = 0; i < data.length; i++) {

                    FlowerBuilder += '  <option value=" ' + data[i].F_ID + '">' + data[i].F_NAME + '</option > ';

                    stringBuilder += ' <div class= "col-sm-4" >'
                    stringBuilder += '<label class="checkbox-inline">';
                    stringBuilder += '  <input type="checkbox" value="" id="' + data[i].F_ID + '" class="ClsChBox clscommon" data-name="' + data[i].F_ID + '" data-flower="' + data[i].F_NAME + '"/> ' + data[i].F_NAME + ' ';
                    stringBuilder += ' </label>';
                    stringBuilder += ' </div >'
                }   
                $("#DivFlowerChcBox").html(stringBuilder);
                $(".SelFloName").html(FlowerBuilder);
            }
            else {
                swal("Unable to get data. Please try again later.");
            }
        }
    });
}

//View & Edit Dealer Details
function TableActions() {

    $(".clstableview").click(function () {
        $("#ClearNewDealer").click();
        $(".clscommon").removeAttr("disabled");
        $(".ClsChBox").attr("checked", false);
        var id = $(this).parent().find("#tblID").text();
        var agreement = $(this).parent().data("agreement");
        var flower = $(this).parent().data("flowerid");
        $("#TxBoxName").val($(this).parent().find("#tblName").text()),
        $("#TxBoxAddress").val($(this).parent().data("address"))
        $("#TxBoxPhone").val($(this).parent().find("#tblPhoneNo").text())
        $("#TxBoxEmail").val($(this).parent().data("email"))
        $("#Fromdate").val($(this).parent().data("fromdate"))
        $("#Todate").val($(this).parent().data("todate"));
        if (agreement.trim() == "Partial") {
            $("#PartialDateRaBtn").prop("checked", true);
            $("#PartialDateRaBtn").click();
        }
        else if (agreement.trim() == "LifeTime")
            {
            $("#LifeTimeRaBtn").prop("checked", true);
            $("#LifeTimeRaBtn").click();
        }
        else
            $("#NoneRaBtn").prop("checked", true);
        var newflower = flower.slice(0, -1);
        var arr = newflower.split("|");
        for (i = 0; i < arr.length; i++) {
            if (arr[i] != "")
                $("#" + arr[i].trim()).prop("checked", true);
        }
        if ($(this).hasClass("clstableEdit") == false) {
            $(".clscommon").attr("disabled", "disabled");
            $("#DivSaveClear,#UpdateDealerBtn,#DivAddFlower,#TxtNewFlower").hide();
            $("#AddNewDealerFormTitle").html("View Wholesale Dealer Details");
        }
        else {
           $("#DivSaveClear").hide();
            $("#DivUpdate,#UpdateDealerBtn,#DivAddFlower").show();
            $("TxtNewFlower").hide();
            $("#AddNewDealerFormTitle").html("Update Wholesale Dealer Details");
        }
        
        $("#AddNewDealerForm").modal("show");
        LoadTable(); 
    });

    //Update The Record
    $("#UpdateDealerBtn").click(function () {

        var flower = "";
        $(".ClsChBox").each(function () {
            if ($(this).prop("checked") == true) {
                flower += $(this).data("name") + "|"
            }
        })

        var AgreementType = "";
        if ($("#PartialDateRaBtn").prop("checked")) {
            AgreementType = "Partial";
        }
        else if ($("#LifeTimeRaBtn").prop("checked")) {
            AgreementType = "LifeTime";
        }
        else {
            AgreementType = "None";
        }
       
        var Values = {
            id: $("#tblID").text(),
            Name: $("#TxBoxName").val(),
            Address: $("#TxBoxAddress").val(),
            PhoneNo: $("#TxBoxPhone").val(),
            Email: $("#TxBoxEmail").val(),
            Flower: flower,
            Agreement: AgreementType,
            FromDate: $("#Fromdate").val(),
            ToDate: $("#Todate").val(),
          
        }

        $.ajax({
            type: "POST",
            url: UpdateUrl,
            data: JSON.stringify(Values),
            contentType: "application/json; charset-utf-8",
            dataType: "json",
            success: function (data) {
                data.Result;
                swal(data.Result);
            },
            error: function (ex) {
                swal("Unable to connect the server");
            }
        });

    });
    $(".clstableDelete").click(function () {
        $("#DeleteModal").modal();
    });
    $("#DeleteBtn").click(function () {
        debugger
        var Values = {
          //  id: $(this).parent().find("#tblID").text()
                id: $("#tblID").text()
        }
        $.ajax({
            type: "POST",
            url: DeleteUrl,
            data: JSON.stringify(Values),
            contentType: "application/json; charset-utf-8",
            dataType: "json",
            success: function (data) {
                data.Result;
                swal(data.Result);
                $("#DeleteModal").modal("hide");
                LoadTable();
            },
            error: function (ex) {
                swal("Unable to connect the server");
            }
        });
    });
}
$(".first").click(function () {
    swal({
        title: "Are You Sure About Deleting This File?",
        type: "info",
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#ff0055",
        cancelButtonColor: "#999999",
        reverseButtons: true,
        focusConfirm: false,
        focusCancel: true
    });
})

$(".second").click(function () {
    swal("Our First Alert", "With Some body text1");;
})

$(".third").click(function () {
    swal("Our First Alert", "with icon");
})
    