import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationPageComponent } from './authentication-page.component';

describe('AuthenticationPageComponent', () => {
    let component: AuthenticationPageComponent;
    let fixture: ComponentFixture<AuthenticationPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuthenticationPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AuthenticationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
