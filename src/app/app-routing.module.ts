import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),canActivate:[AuthGuard] },
  {
    path: 'products', children: [
      { path: '', loadComponent: () => import('./products/products.page').then(x => x.ProductsPage) },
      { path: ':productId', loadComponent: () => import('./products/product-detail/product-detail.page').then(m => m.ProductDetailPage) }
    ],canActivate:[AuthGuard]
  },

  {
    path: 'product-type',

    children: [
      {

        path: '',
        loadComponent: () => import('./product-type/product-type.page').then(x => x.ProductTypePage)

      },
      {
        path: ':productTypeId',
        loadComponent: () => import('./product-type/product-type-detail/product-type-detail.page').then(m => m.ProductTypeDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'zone',
    children: [
      {

        path: '',
        loadComponent: () => import('./zone/zone.page').then(x => x.ZonePage)

      },
      {
        path: ':zoneId',
        loadComponent: () => import('./zone/zone-detail/zone-detail.page').then(m => m.ZoneDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'region',
    children: [
      {

        path: '',
        loadComponent: () => import('./region/region.page').then(x => x.RegionPage)

      },
      {
        path: ':regionId',
        loadComponent: () => import('./region/region-detail/region-detail.page').then(m => m.RegionDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'area',
    children: [
      {

        path: '',
        loadComponent: () => import('./area/area.page').then(x => x.AreaPage)

      },
      {
        path: ':areaId',
        loadComponent: () => import('./area/area-detail/area-detail.page').then(m => m.AreaDetailPage)

      }],canActivate:[AuthGuard]
  },


  {
    path: 'territory',
    children: [
      {

        path: '',
        loadComponent: () => import('./territory/territory.page').then(x => x.TerritoryPage)

      },
      {
        path: ':territoryId',
        loadComponent: () => import('./territory/territory-detail/territory-detail.page').then(m => m.TerritoryDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'customer',
    children: [
      {

        path: '',
        loadComponent: () => import('./customer/customer.page').then(x => x.CustomerPage)

      },
      {
        path: ':customerId',
        loadComponent: () => import('./customer/customer-detail/customer-detail.page').then(m => m.CustomerDetailPage),
      },

    ],canActivate:[AuthGuard]
  },

  {
    path: 'customer-type',
    children: [
      {

        path: '',
        loadComponent: () => import('./customer-type/customer-type.page').then(x => x.CustomerTypePage)

      },
      {
        path: ':customerTypeId',
        loadComponent: () => import('./customer-type/customer-type-detail/customer-type-detail.page').then(m => m.CustomerTypeDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'level',
    children: [
      {

        path: '',
        loadComponent: () => import('./level/level.page').then(x => x.LevelPage)

      },
      {
        path: ':levelId',
        loadComponent: () => import('./level/level-detail/level-detail.page').then(m => m.LevelDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'employee',
    children: [
      {

        path: '',
        loadComponent: () => import('./employee/employee.page').then(x => x.EmployeePage)

      },
      {
        path: ':employeeId',
        loadComponent: () => import('./employee/employee-detail/employee-detail.page').then(m => m.EmployeeDetailPage)

      }],canActivate:[AuthGuard]
  },

  {
    path: 'working-type',

    children: [
      {

        path: '',
        loadComponent: () => import('./working-type/working-type.page').then(x => x.WorkingTypePage)

      },
      {
        path: ':WorkingTypeId',
        loadComponent: () => import('./working-type/working-type-detail/working-type-detail.page').then(m => m.WorkingTypeDetailPage)

      }],canActivate:[AuthGuard]
  },


  {
    path: 'expense-head',

    children: [
      {

        path: '',
        loadComponent: () => import('./expense-head/expense-head.page').then(x => x.ExpenseHeadPage)

      },
      {
        path: ':ExpenseHeadId',
        loadComponent: () => import('./expense-head/expense-head-details.page/expense-head-details.page.page').then(m => m.ExpenseHeadDetailsPagePage)

      }
    ],canActivate:[AuthGuard]
  },


  {
    path: 'dailyactivity',

    children: [
      {

        path: '',
        loadComponent: () => import('./daily-activity/daily-activity.page').then(x => x.DailyActivityPage)

      },
      {
        path: ':dailyactivityId',
        loadComponent: () => import('./daily-activity/daily-activity-detail/daily-activity-detail.page').then(m => m.DailyActivityDetailPage)

      }
    ],canActivate:[AuthGuard]
  },

  {
    path: 'expensemaster',

    children: [
      {

        path: '',
        loadComponent: () => import('./expense-master/expense-master.page').then(x => x.ExpenseMasterPage)

      },
      {
        path: ':expensemasterId',
        loadComponent: () => import('./expense-master/expense-master-details/expense-master-details.page').then(m => m.ExpenseMasterDetailsPage)

      }
    ],canActivate:[AuthGuard]
  },

  {
    path: 'billToAddress',
    children: [
      {
        path: '',
        loadComponent: () => import('./billto-address/billto-address.page').then(x => x.BilltoAddressPage)
      },
      {
        path: ':AddressRowNumber',
        loadComponent: () => import('./billto-address/billtoform/billtoform.page').then(m => m.BilltoAddressPage)
      }

    ],canActivate:[AuthGuard]
  },

  {
    path: 'shiptoaddress',

    children: [
      {
        path: '',
        loadComponent: () => import('./shipto-address/shipto-address.page').then(x => x.ShiptoAddressPage)
      },
      {
        path: ':AddressRowNumber',
        loadComponent: () => import('./shipto-address/shiptoform/shiptoform.page').then(m => m.ShipToAddrsForm)
      }
    ],canActivate:[AuthGuard]
  },

  // {
  //   path: 'head-quarter',
  //   loadComponent: () => import('./head-quarter/head-quarter.page').then(m => m.HeadQuarterPage)
  // },
  // {
  //   path: 'head-quarter-detail',
  //   loadComponent: () => import('./head-quarter/head-quarter-detail/head-quarter-detail.page').then(m => m.HeadQuarterDetailPage)
  // },

  {
    path: 'master',
    loadComponent: () => import('./master/master.page').then(m => m.MasterPage),canActivate:[AuthGuard]
  },
  {
    path: 'transaction',
    loadComponent: () => import('./transaction/transaction.page').then(m => m.TransactionPage),canActivate:[AuthGuard]
  }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
