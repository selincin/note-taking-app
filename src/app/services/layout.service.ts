import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  isTablet$ = this.breakpointObserver.observe('(min-width: 768px) and (max-width: 1023.98px)').pipe(
    map(result => result.matches),
    shareReplay()
  );

  isDesktop$ = this.breakpointObserver.observe('(min-width: 1024px)').pipe(
    map(result => result.matches),
    shareReplay()
  );
}