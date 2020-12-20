using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;

namespace Flo_Sel_Mangement_System.Controllers
{
    public class MainController : Controller
    {
        // GET: Main
        SqlConnection ss = new SqlConnection((ConfigurationManager.AppSettings["connectionString"] != null ? ConfigurationManager.AppSettings["connectionString"].ToString() : @"Data Source=SIRANSAN\SIRANCHEEVI;Initial Catalog=master;Integrated Security=True"));
        string Message = "";
        string Status = "000";

        string strstatus = string.Empty;
        string Errmsg = string.Empty;
        string strresult = string.Empty;
        public ActionResult Index()
        {
            return View();
        }
       
        public ActionResult Login()
        {
            return View();
        }
       
        public ActionResult InsertDealerDetails(string Name, string Address, string PhoneNo, string Email, string FlowerId, string FlowerName, string Agreement, string FromDate, string ToDate)
        {
            try
            {
                string id = "DI" + Name[0] + PhoneNo[0] + PhoneNo[1] + PhoneNo[2] + PhoneNo[3];
                string strQUery = "insert into DEALER_TABLE (D_ID,D_NAME,D_ADDRESS,D_PHONE_NO, D_EMAIL_ID,D_FLOWER_ID,D_FLOWER_NAME,D_AGREEMENT,D_FROM_DATE,D_TO_DATE) VALUES ('" + id + "','" + Name + "','" + Address + "','" + PhoneNo + "','" + Email + "','" + FlowerId + "','" + FlowerName + "','" + Agreement + "','" + FromDate + "','" + ToDate + "')";
                ss.Open();
                SqlCommand cmd = new SqlCommand(strQUery, ss);
                cmd.ExecuteNonQuery();
                ss.Close();
                Status = "00";
                Message = "Whole sale Dealer Details Inserted Succesfully.";
            }
            catch (Exception ex)
            {
                Message = "Unable to Insert The Details";
                Status = "01";
            }
            return Json(new { Result = Message, Code = Status });
        }
        public ActionResult UpdateDealerDetails(string id, string Name, string Address, string PhoneNo, string Email, string Flower, string Agreement, string FromDate, string ToDate)
        {
            try
            {
                string strQUery = "UPDATE DEALER_TABLE SET D_NAME='" + Name + "',D_ADDRESS='" + Address + "',D_PHONE_NO='" + PhoneNo + "', D_EMAIL_ID='" + Email + "',D_FLOWER_ID='" + Flower + "',D_AGREEMENT='" + Agreement + "',D_FROM_DATE='" + FromDate + "',D_TO_DATE='" + ToDate + "'  WHERE D_ID='" + id.Trim() + "'  ";
                ss.Open();
                SqlCommand cmd = new SqlCommand(strQUery, ss);
                cmd.ExecuteNonQuery();
                ss.Close();
                Status = "00";
                Message = "Updated Succesfully";
            }
            catch (Exception ex)
            {
                Message = "Unable to registered your details. Please contact customer care";
                Status = "01";
            }
            return Json(new { Result = Message, Code = Status });
        }

        public ActionResult DeleteDealerDetails(string id)
        {
            try
            {
                string strcmd = "delete  from DEALER_TABLE WHERE D_ID='" + id.Trim() + "'";
                ss.Open();
                SqlCommand cmd = new SqlCommand(strcmd, ss);
                cmd.ExecuteNonQuery();
                ss.Close();
                Status = "00";
                Message = "Deleted Succesfully.";
            }
            catch (Exception ex)
            {
                Status = "01";
                Message = " Unable to get data. Please contact support team ";
            }

            return Json(new { Result = Message, Code = Status });
        }

        public ActionResult PurchaseDetails ( string DealerId, string Date, string DealerName, string FlowerId, string FlowerName, string Quantity, string Price, string Amount)
        {
            try
            {
                string strQUery = "insert into PURCHASE_TABLE (E_ID,E_DATE,E_DEALER_NAME,E_FLOWER_ID,E_FLOWER_NAME,E_QUANTITY,E_PRICE,E_AMOUNT) VALUES ('" + DealerId + "','" + Date + "','" + DealerName + "','" + FlowerId + "','" + FlowerName + "','" + Quantity + "','" + Price + "','" + Amount + "')";
                ss.Open();
                SqlCommand cmd = new SqlCommand(strQUery, ss);
                cmd.ExecuteNonQuery();
                ss.Close();
                Status = "00";
                Message = "Purchased Details Inserted Succesfully.";
            }
            catch (Exception ex)
            {
                Message = "Unable to Insert The Purchase Details";
                Status = "01";
            }
            return Json(new { Result = Message, Code = Status });
        }

        public ActionResult FilterData(string Dname, string Fname, string Date)

        {
            try
            {
                string strcmd = "select * from  PURCHASE_TABLE WHERE E_ID ='" + Dname + "' OR E_FLOWER_ID='" + Fname + "' OR E_DATE='" + Date + "'";
                DataTable dt = new DataTable();
                ss.Open();
                SqlCommand cmd = new SqlCommand(strcmd, ss);
                SqlDataAdapter adpt = new SqlDataAdapter();
                adpt.SelectCommand = cmd;
                adpt.Fill(dt);
                ss.Close();

                if (dt.Rows.Count > 0)
                {
                    strresult = JsonConvert.SerializeObject(dt);
                    strstatus = "00";
                    Errmsg = "";
                }
                else
                {
                    strstatus = "01";
                    Errmsg = "No Data Found";
                }


            }
            catch (Exception ex)
            {
                strstatus = "01";
                Errmsg = " Unable to get data. Please contact support team ";
            }

            return Json(new { Status = strstatus, Message = Errmsg, result = strresult });
            // Checking no of files injected in Request object  

        }
        public ActionResult InsertNewFlower(string Newflower)
        {
         
            try
            {
                
                string id = "FID" + Newflower[0] + Newflower[1] + Newflower[2];
                string strQUery = "insert into FLOWER_TABLE(F_ID,F_NAME)  VALUES ('" + id + "','" + Newflower + "')";
                ss.Open();
                SqlCommand cmd = new SqlCommand(strQUery, ss);
                cmd.ExecuteNonQuery();
                ss.Close();
                Status = "00";
                Message = "New Flower Type Inserted Succesfully.";
                
            }
            catch (Exception ex)
            {
                Message = "Unable to Insert New Flower Type";
                Status = "01";
            }
            return Json(new { Result = Message, Status = Status , });
        }
   
    public ActionResult GetDealerTable(string strtemp)
    {     
        try
        {
            string strcmd = "select * from  DEALER_TABLE";
            DataTable dt = new DataTable();
            ss.Open();
            SqlCommand cmd = new SqlCommand(strcmd, ss);
            SqlDataAdapter adpt = new SqlDataAdapter();
            adpt.SelectCommand = cmd;
            adpt.Fill(dt);
            ss.Close();

            if (dt.Rows.Count > 0)
            {
                strresult = JsonConvert.SerializeObject(dt);
                strstatus = "00";
                Errmsg = "";
            }
            else
            {
                strstatus = "01";
                Errmsg = "No Data Found";
            }
        }
        catch (Exception ex)
        {
            strstatus = "01";
            Errmsg = " Unable to get data. Please contact support team ";
        }
        return Json(new { Status = strstatus, Message = Errmsg, result = strresult });       
    }

    public ActionResult GetFlowerTable(string strtemp)
    {     
        try
        {
            string strcmd = "select * from  FLOWER_TABLE";
            DataTable dt = new DataTable();
            ss.Open();
            SqlCommand cmd = new SqlCommand(strcmd, ss);
            SqlDataAdapter adpt = new SqlDataAdapter();
            adpt.SelectCommand = cmd;
            adpt.Fill(dt);
            ss.Close();

            if (dt.Rows.Count > 0)
            {
                strresult = JsonConvert.SerializeObject(dt);
                strstatus = "00";
                Errmsg = "";
            }
            else
            {
                strstatus = "01";
                Errmsg = "No Data Found";
            }
        }
        catch (Exception ex)
        {
            strstatus = "01";
            Errmsg = " Unable to get data. Please contact support team ";
        }
        return Json(new { Status = strstatus, Message = Errmsg, result = strresult });       
    }
}
}