import { List } from './List';
import { ArrayList } from './ArrayList';
import { Component } from './Component';

export class GameObject {
  private readonly components:List<Component>;

  public constructor() {
    this.components = new ArrayList<Component>();
  }

  public addComponent<T extends Component>(component:T):void {
    this.components.put(component);
  }

  public getComponent<T extends Component>():T {
    return this.components.peek(0) as T;
  }
}
