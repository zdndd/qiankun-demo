import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { OtherComponent } from 'src/app/other/other.component';

const routes: Routes = [
  {
    path: 'angular10',
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: 'wwe',
            component: OtherComponent,
          },
          {
            path: 'other',
            component: OtherComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // relativeLinkResolution: 'corrected',
      errorHandler(...arg) {
        console.log('errorHandler', ...arg);
      },
      // @ts-ignore
      malformedUriErrorHandler(...arg) {
        console.log('malformedUriErrorHandler', ...arg);
      },
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
