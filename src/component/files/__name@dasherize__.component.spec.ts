import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';

describe('<%= classify(name) %>Component', () => {
	let fixture: ComponentFixture<<%= classify(name) %>Component>;
	let component: <%= classify(name) %>Component;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CommonModule],
			declarations: [<%= classify(name) %>Component],
		}).compileComponents();
		fixture = TestBed.createComponent(<%= classify(name) %>Component);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
