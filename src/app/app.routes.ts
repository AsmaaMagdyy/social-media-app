import { Routes } from '@angular/router';
import { AuthlayoutComponent } from './components/authlayout/authlayout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BlanklayoutComponent } from './components/blanklayout/blanklayout.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { authguardGuard } from './core/guards/authguard.guard';
import { logedguardGuard } from './core/guards/logedguard.guard';
import { AccountComponent } from './components/account/account.component';
import { MypostsComponent } from './core/components/myposts/myposts.component';
import { SinglePostComponent } from './components/single-post/single-post.component';

export const routes: Routes = [
    {path:'',component:AuthlayoutComponent,canActivate:[logedguardGuard],children:[
        {path:'',redirectTo:'login',pathMatch:'full'},
        {path:'login',component:LoginComponent,title:'login'},
        {path:'register',component:RegisterComponent,title:'register'},
    ]},
    {path:'',component:BlanklayoutComponent,canActivate:[authguardGuard],children:[
        {path:'',redirectTo:'timeline',pathMatch:'full'},
        {path:'timeline',component:TimelineComponent,title:'Timeline'},
        {path:'account',component:AccountComponent,title:'My accont'},
        {path:'myPosts',component:MypostsComponent,title:'My posts'},
        {path:'myPost/:id',component:SinglePostComponent,title:'My post'},
    ]},
    {path:'**',loadComponent: () => import('./components/notfound/notfound.component').then((c) => c.NotfoundComponent)}
    
];
