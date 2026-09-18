import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly DESKTOP_QUERY = '(min-width: 1024px)';

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  isDesktop$ = this.breakpointObserver.observe(this.DESKTOP_QUERY).pipe(
    map(result => result.matches),
    shareReplay()
  );
}