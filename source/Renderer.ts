import { PriorityStack } from './PriorityStack';
import { RenderObject } from  './RenderObject';

export class Renderer implements RenderObject {
  private readonly renderStack:PriorityStack<RenderObject>;

  public constructor(renderStack:PriorityStack<RenderObject>) {
    this.renderStack = renderStack;
  }

  public render():void {
    for(const EL of this.renderStack) {
      EL.render();
    }
  }
}