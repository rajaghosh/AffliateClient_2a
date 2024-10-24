import { DatePipe } from '@angular/common';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserEarning } from 'src/app/models/product.model';
import { UserDetailsDTO } from 'src/app/models/user.model';
import { ProductService } from 'src/app/service/http-services/product.service';
import { UserService } from 'src/app/service/http-services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  isAdmin: boolean = false;
  lifetimeSale: number = 0;
  lastMonthSale: number = 0
  lifetimeOrder: number = 0;
  lastMonthOrder: number = 0;
  ofAllUser: string = "";

  constructor(
    private affiliateService: UserService,
    private affiliateProdService: ProductService,
    private dialog: MatDialog,
    private datePipe: DatePipe) {

    this.getUserEarning();
  }

  edate: Date = new Date();
  sdate: Date = new Date(new Date().setDate(this.edate.getDate() - 30));

  affiliateList: UserDetailsDTO[] = [];
  affiliateUserEarningList: UserEarning[] = [];

  loggedUser?: string = localStorage.getItem("loggedUser")?.toString();
  reportTypeList: any[] = [{ id: "datewise", name: "Date-wise" }, { id: "monthwise", name: "Month-wise" }, { id: "yearwise", name: "Year-wise" }];
  barchartModel: any = {};
  linechartModel: any = {};

  searchReportForm = new FormGroup({
    affiliate: new FormControl("", [Validators.required]),
    reportType: new FormControl("datewise"),
    startDate: new FormControl(this.sdate),
    endDate: new FormControl(this.edate)
  });

  @ViewChildren(BaseChartDirective) charts?: QueryList<BaseChartDirective>;
  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  getUserEarning(selectedEmail: string = "") {

    let emailParam: string = "";

    // debugger;

    if (localStorage.getItem("type") !== null && localStorage.getItem("type") == "\"%^&@#!#$$#@$!#!##@$##@#$@@@#$!@#!@#@1\"") {
      this.isAdmin = true;
      this.ofAllUser = selectedEmail == "" ? "All users details for Admin" : "";
      emailParam = selectedEmail;
    }
    else {
      this.isAdmin = false;
      emailParam = this.loggedUser != null ? this.loggedUser : "";
      this.ofAllUser = "";
    }

    this.affiliateProdService.getSaleForUserAsync(emailParam).subscribe(res => {
      //debugger;
      if (res && res.data) {
        this.affiliateUserEarningList = res.data;

        let earningsLifetime: any[] = this.affiliateUserEarningList.filter(p => p.type == 'LifetimeEarning').map(p => p.earning);
        earningsLifetime.forEach(element => {
          this.lifetimeSale = element ?? 0;
        });

        let earningsLastMonthSale: any[] = this.affiliateUserEarningList.filter(p => p.type == 'LastMonthEarning').map(p => p.earning);
        earningsLastMonthSale.forEach(element => {
          this.lastMonthSale = element ?? 0;
        });

        let ordersLifetime: any[] = this.affiliateUserEarningList.filter(p => p.type == 'LifetimeOrder').map(p => p.earning);
        ordersLifetime.forEach(element => {
          this.lifetimeOrder = element ?? 0;
        });

        let orderLastMonthSale: any[] = this.affiliateUserEarningList.filter(p => p.type == 'LastMonthOrder').map(p => p.earning);
        orderLastMonthSale.forEach(element => {
          this.lastMonthOrder = element ?? 0;
        });

      }
      else{
        this.lifetimeSale = 0;
        this.lastMonthSale = 0;
        this.lifetimeOrder = 0;
        this.lastMonthOrder = 0;
      }
    });
  }


  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      },

    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true }
    },
  };

  lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  };

  ngOnInit() {
    this.initializeSearchPannel();
  }

  initializeSearchPannel() {
    this.affiliateService.getAfficiateUserDetails().subscribe(res => {
      // debugger;
      if (res && res.data) {
        // if (this.isAdmin)
        this.affiliateList = res.data;

        if (this.isAdmin) {
          this.searchReportForm.controls['affiliate'].enable();
        }
        if (!this.isAdmin) {
          // debugger;
          let userEmail = localStorage.getItem("loggedUser") ?? "";
          this.affiliateList = this.affiliateList.filter(p => p.email == userEmail);

          this.searchReportForm.controls['affiliate'].disable();
          this.searchReportForm.get('affiliate')?.setValue(userEmail);

        }

        this.loggedUser = this.getCurrentUser(this.affiliateList);
        this.searchReportForm.patchValue({ affiliate: this.loggedUser });
      }
    });
  }
  getSaleReportDetails() {
    let form = this.searchReportForm;

    //debugger;
    let userEmail = localStorage.getItem("loggedUser") ?? "";
    let searchModel: any = {
      isAdmin: true, //will be a calculative value
      reportType: form.value["reportType"],
      selectedAffiliate: form.value["affiliate"] ?? userEmail,
      startDate: this.datePipe.transform(form.value["startDate"], "yyyy-MM-dd"),
      endDate: this.datePipe.transform(form.value["endDate"], "yyyy-MM-dd"),
    };

    const dialogRefChartLoad = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        message: "Data load in progress...",
        spinnerOn: true,
        confirmButtonText: '',
        buttonText: {
          ok: '',
          cancel: ''
        }
      }
    });

    this.affiliateService.getSaleReportDetails(searchModel).subscribe(res => {
      // debugger;
      if (res && res.data) {
        // debugger;
        this.barchartModel = res.data;

        this.barChartData.labels = this.barchartModel.labels;
        this.barChartData.datasets = this.barchartModel.datasets;
        this.charts?.forEach((child) => {
          child.chart?.update()
        });

        //Load 2nd chart
        this.affiliateService.getTotalSalesCountReportDetails(searchModel).subscribe(res => {
          if (res && res.data) {
            // debugger;
            this.linechartModel = res.data;

            this.lineChartData.labels = this.linechartModel.dateValue;
            this.lineChartData.datasets = [{
              data: this.linechartModel.totalCount,
              label: 'Total Count',
              yAxisID: 'y1',
              backgroundColor: 'rgba(255,0,0,0.3)',
              borderColor: 'red',
              pointBackgroundColor: 'rgba(148,159,177,1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(148,159,177,0.8)',
              fill: 'origin',
            }];
            this.charts?.forEach((child) => {
              child.chart?.update()
            });

            if (this.isAdmin) {
              this.getUserEarning(form.value["affiliate"] ?? userEmail);
            }
            else{
              this.getUserEarning(userEmail);
            }
            // else
            dialogRefChartLoad.close();
          }
          else {
            //Close loader on error on chart 2
            this.linechartModel = null;
            this.lineChartData.labels = [];
            this.lineChartData.datasets = [];

            dialogRefChartLoad.close();
          }
        });
      }
      else {
        //Close loader on error on chart 1
        this.barchartModel = null;
        this.barChartData.labels = [];
        this.barChartData.datasets = [];

        dialogRefChartLoad.close();
      }




    });

  }

  getCurrentUser(userList: any[]) {
    let user: string = "";
    if (userList && userList.filter(f => f.email == this.loggedUser).length > 0) {
      user = userList.filter(f => f.email == this.loggedUser)[0].email;
    }
    return user;
  }

  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {

  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {

  }

  randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40];

    this.charts?.forEach((child) => {
      child.chart?.update()
    });
  }

  groupBy(xs: any[], key: any) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

}
