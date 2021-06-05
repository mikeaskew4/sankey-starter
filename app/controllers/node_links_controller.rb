class NodeLinksController < ApplicationController
  before_action :set_node_link, only: [:show, :edit, :update, :destroy]

  # GET /node_links
  # GET /node_links.json
  def index
    @node_links = NodeLink.all
  end

  # GET /node_links/1
  # GET /node_links/1.json
  def show
  end

  # GET /node_links/new
  def new
    @node_link = NodeLink.new
  end

  # GET /node_links/1/edit
  def edit
  end

  # POST /node_links
  # POST /node_links.json
  def create
    @node_link = NodeLink.new(node_link_params)

    respond_to do |format|
      if @node_link.save
        format.html { redirect_to @node_link, notice: 'Node link was successfully created.' }
        format.json { render :show, status: :created, location: @node_link }
      else
        format.html { render :new }
        format.json { render json: @node_link.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /node_links/1
  # PATCH/PUT /node_links/1.json
  def update
    respond_to do |format|
      if @node_link.update(node_link_params)
        format.html { redirect_to @node_link, notice: 'Node link was successfully updated.' }
        format.json { render :show, status: :ok, location: @node_link }
      else
        format.html { render :edit }
        format.json { render json: @node_link.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /node_links/1
  # DELETE /node_links/1.json
  def destroy
    @node_link.destroy
    respond_to do |format|
      format.html { redirect_to node_links_url, notice: 'Node link was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_node_link
      @node_link = NodeLink.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def node_link_params
      params.require(:node_link).permit(:node_id_id, :link_id_id)
    end
end
